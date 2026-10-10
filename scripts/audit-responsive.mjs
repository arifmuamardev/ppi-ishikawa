import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

// Render the built Astro site in Chromium, at fixed widths. No production data is modified.
// Run locally: npm run build && npm run preview -- --host 127.0.0.1 --port 4321
// Then: node scripts/audit-responsive.mjs
const baseURL = (process.env.RESPONSIVE_BASE_URL || 'http://127.0.0.1:4321/ppi-ishikawa').replace(/\/$/, '');
const routes = [
  ['home', '/'],
  ['about', '/about/'],
  ['community', '/community/'],
  ['directory', '/resources/'],
  ['stories', '/stories/'],
  ['programs', '/programs/'],
  ['places', '/life-in-ishikawa/places/'],
  ['life-in-ishikawa', '/life-in-ishikawa/'],
  ['contact', '/contact/'],
  ['member', '/member/'],
  ['family', '/life-in-ishikawa/family-anak/'],
  ['family-starter', '/life-in-ishikawa/family/starter-pack/'],
  ['family-timeline', '/life-in-ishikawa/family/timeline/'],
  ['campus', '/community/kampus/'],
  ['campus-kanazawa', '/community/kampus/kanazawa-university/'],
  ['guide-campus-jaist', '/community/kampus/jaist/'],
  ['guide-campus-kit', '/community/kampus/kanazawa-institute-of-technology/'],
  ['guide-campus-ipu', '/community/kampus/ishikawa-prefectural-university/'],
  ['guide-campus-kinjo', '/community/kampus/kinjo-university/'],
  ['guide-campus-alice', '/community/kampus/alice-gakuen/'],
  ['guide-sg01', '/life-in-ishikawa/sebelum-berangkat/'],
  ['guide-sg03', '/life-in-ishikawa/administrasi/'],
  ['guide-f01', '/life-in-ishikawa/family/datang-bersama-keluarga/'],
  ['guide-f05', '/life-in-ishikawa/family/benefit-kesehatan/'],
  ['scholarships', '/beasiswa/'],
  ['career', '/career/'],
  ['family-activities', '/life-in-ishikawa/family/aktivitas/']
];
const widths = [360, 390, 430, 768, 1280];
const outputDir = 'responsive-audit';
const screenshotDir = path.join(outputDir, 'screenshots');
await mkdir(screenshotDir, { recursive: true });

const report = {
  generatedAt: new Date().toISOString(),
  baseURL,
  widths,
  routes: routes.map((item) => item[1]),
  checks: [],
};
const browser = await chromium.launch({ headless: true, channel: 'chrome' });

async function measure(page) {
  return page.evaluate(() => {
    const viewport = document.documentElement.clientWidth;
    const bodyScrollWidth = document.body?.scrollWidth || 0;
    const scrollWidth = Math.max(document.documentElement.scrollWidth, bodyScrollWidth);
    const h1Count = document.querySelectorAll('main h1').length;
    const possibleOverflow = Array.from(document.querySelectorAll('body *'))
      .filter((element) => {
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        const box = element.getBoundingClientRect();
        return box.width > 0 && box.height > 0 && box.right > viewport + 2;
      })
      .slice(0, 8)
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        className: String(element.className?.baseVal ?? element.className ?? '').slice(0, 140),
        text: (element.textContent || '').trim().slice(0, 90),
      }));
    const smallTargets = Array.from(document.querySelectorAll('header a, header summary, footer a, footer button'))
      .filter((el) => {
        const box = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return box.width > 0 && box.height > 0 && box.height < 40 && s.visibility !== 'hidden' && s.display !== 'none';
      }).slice(0, 10).map((el) => ({ tag: el.tagName.toLowerCase(), label: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 50), height: Math.round(el.getBoundingClientRect().height) }));
    return { viewport, scrollWidth, overflowPx: Math.max(0, scrollWidth - viewport), h1Count, possibleOverflow, smallTargets };
  });
}

let failures = 0;
try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 800 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    for (const [key, pathname] of routes) {
      const check = { width, route: pathname, name: key, errors: [], warnings: [] };
      try {
        // Paths include Astro's /ppi-ishikawa base, including for the root page.
        const URL = baseURL + (pathname === '/' ? '/' : pathname);
        const response = await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
        check.httpStatus = response?.status() ?? null;
        if (check.httpStatus !== 200) check.errors.push('HTTP ' + check.httpStatus);
        await page.evaluate(() => document.fonts.ready);
        // Typography regression: ensure the self-hosted Fira Sans has loaded,
        // and do not let a browser fallback silently pass the responsive audit.
        if (width === 390 && key === 'home') {
          check.typography = await page.evaluate(() => ({
            computedFamily: getComputedStyle(document.body).fontFamily,
            loaded: Array.from(document.fonts).filter((face) =>
              face.family.includes('Fira Sans') && face.status === 'loaded').length,
            ready: document.fonts.check('400 16px "Fira Sans"')
          }));
          if (!check.typography.computedFamily.includes('Fira Sans') ||
              !check.typography.ready || check.typography.loaded < 1) {
            check.errors.push('Fira Sans must be the computed, locally loaded font: ' +
              JSON.stringify(check.typography));
          }
        }
        // Semantic type hierarchy is centrally controlled, not per-page.
        // Hero and page display titles get the approved Fira Sans B hierarchy.
        if ((width === 390 || width === 1280) &&
          (key === 'home' || key === 'about' || key === 'scholarships' || key === 'guide-sg01')) {
          check.typeHierarchy = await page.evaluate(() => {
            const first = (selector) => {
              const element = document.querySelector(selector);
              return element ? {
                weight: Number(getComputedStyle(element).fontWeight),
                family: getComputedStyle(element).fontFamily,
                size: parseFloat(getComputedStyle(element).fontSize)
              } : null;
            };
            return {
              hero: first('main h1.type-hero'),
              display: first('main h1.type-display'),
              section: first('main h2.type-section'),
              lead: first('main .type-lead')
            };
          });
          if (key === 'home' && check.typeHierarchy.hero?.weight !== 900)
            check.errors.push('Homepage hero must use weight 900, not generic heading weight');
          if (key !== 'home' && check.typeHierarchy.display?.weight !== 800)
            check.errors.push('Page Intro title must use weight 800');
          if (check.typeHierarchy.section && check.typeHierarchy.section.weight !== 700)
            check.errors.push('Section titles should retain calm weight 700');
          const headline = check.typeHierarchy.hero || check.typeHierarchy.display;
          if (!headline?.family?.includes('Fira Sans'))
            check.errors.push('Semantic page title must inherit approved Fira Sans family');
        }
        // Approved Balanced tokens must have measurable effects on the homepage.
        if ((width === 390 || width === 1280) && key === 'home') {
          check.balancedSpacing = await page.evaluate(() => {
            const px = (selector, property) => {
              const element = document.querySelector(selector);
              return element ? parseFloat(getComputedStyle(element)[property]) : null;
            };
            return {
              section: px('main .ui-section-space', 'paddingTop'),
              card: px('main .ui-card-space-balanced', 'paddingTop'),
              grid: px('main .ui-grid-gap-balanced', 'columnGap'),
              sections: document.querySelectorAll('main .ui-section-space').length,
              cards: document.querySelectorAll('main .ui-card-space-balanced').length
            };
          });
          const { section, card, grid, sections, cards } = check.balancedSpacing;
          if (sections < 4 || cards < 1 ||
            Math.abs(section - (width === 390 ? 52 : 68)) > .75 ||
            Math.abs(card - 23) > .5 || Math.abs(grid - 14) > .5) {
            check.errors.push('Balanced spacing tokens have drifted: ' +
              JSON.stringify(check.balancedSpacing));
          }
        }
        // Approved Balanced + Subtle radius / border contract, measured from
        // real production elements rather than only inspecting CSS constants.
        if ((width === 390 || width === 1280) &&
          (key === 'home' || key === 'community' || key === 'programs' ||
           key === 'scholarships' || key === 'guide-sg01')) {
          check.geometry = await page.evaluate(() => {
            const element = (selector) => document.querySelector(selector);
            const numeric = (selector, name) => {
              const el = element(selector);
              return el ? Number.parseFloat(getComputedStyle(el)[name]) : null;
            };
            const root = getComputedStyle(document.documentElement);
            // getPropertyValue returns the raw token (e.g. "0.75rem"),
            // so resolve rem to px rather than incorrectly treating it as px.
            const rem = Number.parseFloat(root.fontSize);
            const radiusTokenPx = (name) => {
              const token = root.getPropertyValue(name).trim();
              const number = Number.parseFloat(token);
              return token.endsWith('rem') ? number * rem : number;
            };
            const tokens = {
              control: radiusTokenPx('--ui-radius-control'),
              card: radiusTokenPx('--ui-radius-card'),
              feature: radiusTokenPx('--ui-radius-feature'),
              border: Number.parseFloat(root.getPropertyValue('--ui-border-subtle-width'))
            };
            return {
              tokens,
              navigationRadius: numeric('[data-ui-card="navigation"]', 'borderTopLeftRadius'),
              navigationBorder: numeric('[data-ui-card="navigation"]', 'borderTopWidth'),
              resultRadius: numeric('[data-ui-card="result"]', 'borderTopLeftRadius'),
              resultBorder: numeric('[data-ui-card="result"]', 'borderTopWidth'),
              cautionRadius: numeric('[data-ui-panel="advisory"][data-tone="caution"]', 'borderTopLeftRadius'),
              highlightRadius: numeric('[data-ui-panel="highlight"]', 'borderTopLeftRadius'),
              fieldRadius: numeric('.ui-field', 'borderTopLeftRadius'),
              fieldBorder: numeric('.ui-field', 'borderTopWidth'),
              actionRadius: numeric('.ui-action-primary, .ui-action-secondary', 'borderTopLeftRadius')
            };
          });
          const g = check.geometry;
          const nearly = (actual, expected) => actual === null || Math.abs(actual - expected) <= .5;
          if (g.tokens.control !== 12 || g.tokens.card !== 16 ||
              g.tokens.feature !== 24 || g.tokens.border !== 1 ||
              !nearly(g.navigationRadius, 16) || !nearly(g.navigationBorder, 1) ||
              !nearly(g.resultRadius, 16) || !nearly(g.resultBorder, 1) ||
              !nearly(g.cautionRadius, 16) || !nearly(g.highlightRadius, 24) ||
              !nearly(g.fieldRadius, 12) || !nearly(g.fieldBorder, 1) ||
              !nearly(g.actionRadius, 12)) {
            check.errors.push('Approved Balanced + Subtle geometry drift: ' +
              JSON.stringify(g));
          }
        }
        // Standard + Tinted Tile iconography: check actual SVG and tile CSS,
        // including corner treatment, on representative 390/1280px routes.
        if ((width === 390 || width === 1280) &&
          (key === 'home' || key === 'community' || key === 'contact' ||
           key === 'career' || key === 'life-in-ishikawa')) {
          check.iconography = await page.evaluate(() => {
            const root = getComputedStyle(document.documentElement);
            const holder = document.querySelector('main .ui-icon-tile');
            const svg = holder?.querySelector('svg.ui-topic-icon');
            if (!holder || !svg) return { missing: true };
            const surface = getComputedStyle(holder);
            const icon = getComputedStyle(svg);
            return {
              strokeToken: Number.parseFloat(root.getPropertyValue('--ui-icon-stroke')),
              stroke: Number.parseFloat(icon.strokeWidth),
              tileWidth: holder.getBoundingClientRect().width,
              tileHeight: holder.getBoundingClientRect().height,
              glyphWidth: svg.getBoundingClientRect().width,
              glyphHeight: svg.getBoundingClientRect().height,
              tileRadius: Number.parseFloat(surface.borderTopLeftRadius),
              tinted: surface.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
                surface.backgroundColor !== 'transparent',
              hidden: svg.getAttribute('aria-hidden') === 'true',
              rounded: svg.getAttribute('stroke-linecap') === 'round' &&
                svg.getAttribute('stroke-linejoin') === 'round'
            };
          });
          const i = check.iconography;
          if (i.missing || i.strokeToken !== 1.8 || Math.abs(i.stroke - 1.8) > .1 ||
              Math.abs(i.tileWidth - 44) > .75 || Math.abs(i.tileHeight - 44) > .75 ||
              Math.abs(i.glyphWidth - 24) > .75 || Math.abs(i.glyphHeight - 24) > .75 ||
              Math.abs(i.tileRadius - 12) > .75 || !i.tinted || !i.hidden || !i.rounded) {
            check.errors.push('Approved Standard + Tinted iconography drift: ' +
              JSON.stringify(i));
          }
        }
        check.default = await measure(page);
        if (check.default.overflowPx > 2) check.errors.push('Horizontal overflow: ' + check.default.overflowPx + 'px');
        if (check.default.h1Count !== 1) check.errors.push('Expected 1 main h1; got ' + check.default.h1Count);

        // Kampus is in the main menu even though its URL is nested under
        // Komunitas; Keluarga remains a nested landing with breadcrumbs.
        if ((width === 390 || width === 1280) && (key === 'campus' || key === 'family')) {
          const breadcrumbs = await page.locator('main nav[aria-label="Breadcrumb"]').count();
          check.breadcrumbCount = breadcrumbs;
          if (key === 'campus' && breadcrumbs !== 0) {
            check.errors.push('Kampus is a primary menu route and must not show breadcrumbs');
          }
          if (key === 'family' && breadcrumbs !== 1) {
            check.errors.push('Nested Family landing must keep its breadcrumb');
          }
        }

        // Template C quality gates are semantic, not screenshot-only:
        // hierarchical breadcrumb, verified sources, usable TOC targets,
        // and exactly one end-navigation family on linear/campus guides.
        const isCampusGuide = key === 'campus-kanazawa' || key.startsWith('guide-campus-');
        const isSurvivalGuide = key.startsWith('guide-sg');
        const isFamilyGuide = key.startsWith('guide-f');
        if ((width === 390 || width === 1280) &&
            (isCampusGuide || isSurvivalGuide || isFamilyGuide)) {
          const detail = await page.evaluate(() => {
            const main = document.querySelector('main');
            const breadcrumbs = main?.querySelectorAll('nav[aria-label="Breadcrumb"]') || [];
            const source = main?.querySelector('[data-ui-source-block]');
            const navs = [...(main?.querySelectorAll('[data-ui-next-navigation]') || [])];
            const toc = [...(main?.querySelectorAll('nav[aria-label="Daftar isi panduan"] a[href^="#"]') || [])];
            const deadAnchors = toc.filter((link) =>
              !document.getElementById(decodeURIComponent(link.hash.slice(1)))
            ).map((link) => link.getAttribute('href'));
            const last = breadcrumbs[0]?.querySelector('[aria-current="page"]');
            return {
              breadcrumbCount: breadcrumbs.length,
              breadcrumbCurrent: Boolean(last),
              sourceCount: main?.querySelectorAll('[data-ui-source-block]').length ?? 0,
              sourceType: source?.getAttribute('data-ui-source-block'),
              sourceLinks: source?.querySelectorAll('a[href^="http"]').length ?? 0,
              endNavigationCount: navs.length,
              endNavigationType: navs[0]?.getAttribute('data-ui-next-navigation') || null,
              sourceBeforeNav: Boolean(source && navs[0] &&
                (source.compareDocumentPosition(navs[0]) & Node.DOCUMENT_POSITION_FOLLOWING)),
              tocCount: toc.length,
              deadAnchors,
              verifiedText: main?.textContent?.includes('Diverifikasi') ||
                main?.textContent?.includes('diverifikasi') || false,
              familyReturn: Boolean(main?.querySelector('a[href*="/family-anak/"]'))
            };
          });
          check.detailGuide = detail;
          if (detail.breadcrumbCount !== 1 || !detail.breadcrumbCurrent ||
              detail.sourceCount !== 1 || !detail.verifiedText ||
              detail.deadAnchors.length > 0) {
            check.errors.push('Detail Guide requires one current-page breadcrumb, verified metadata, one source block and working TOC anchors');
          }
          if (isCampusGuide && (detail.sourceType !== 'campus' ||
              detail.sourceLinks < 1 || detail.endNavigationCount !== 1 ||
              detail.endNavigationType !== 'related' || !detail.sourceBeforeNav ||
              detail.tocCount < 1)) {
            check.errors.push('Campus Guide requires TOC, official-source disclosure, then one related navigation');
          }
          if (isSurvivalGuide && (detail.sourceType !== 'official' ||
              detail.sourceLinks < 1 || detail.endNavigationCount !== 1 ||
              detail.endNavigationType !== 'linear' || !detail.sourceBeforeNav ||
              detail.tocCount < 1)) {
            check.errors.push('Survival Guide requires TOC, sources, then one linear pager');
          }
          if (isFamilyGuide && (detail.sourceType !== 'official' ||
              detail.sourceLinks < 1 || detail.endNavigationCount !== 0 ||
              !detail.familyReturn)) {
            check.errors.push('Family Guide requires official sources and a return to the family landing, without pager/related duplication');
          }
        }

        const menu = page.locator('header details summary').first();
        if (await menu.count() && await menu.isVisible()) {
          await menu.click();
          check.menuOpen = await page.locator('header details').first().evaluate((el) => el.open);
          const opened = await measure(page);
          check.menuOverflowPx = opened.overflowPx;
          if (!check.menuOpen) check.errors.push('Mobile menu did not open');
          if (opened.overflowPx > 2) check.errors.push('Menu open caused overflow: ' + opened.overflowPx + 'px');
          await menu.click();
        }
        const toc = page.locator('nav[aria-label="Daftar isi panduan"] details summary').first();
        if (await toc.count() && await toc.isVisible()) {
          await toc.click();
          check.tocOpen = await page.locator('nav[aria-label="Daftar isi panduan"] details').first().evaluate((el) => el.open);
          const opened = await measure(page);
          check.tocOverflowPx = opened.overflowPx;
          if (!check.tocOpen) check.errors.push('Guide TOC did not open');
          if (opened.overflowPx > 2) check.errors.push('TOC open caused overflow: ' + opened.overflowPx + 'px');
          await toc.click();
        }
        check.screenshot = path.join('screenshots', key + '-' + width + '.jpg');
        await page.screenshot({
          path: path.join(outputDir, check.screenshot),
          type: 'jpeg', quality: 65, fullPage: true, animations: 'disabled', timeout: 30000
        });
        // Supporting section spacing should be uniform within the same role,
        // without increasing the gap before the initial task on Landing pages.
        if ((width === 390 || width === 1280) && key === 'about') {
          const spacing = await page.evaluate(() =>
            ['arah', 'nilai', 'cara-kerja', 'struktur-organisasi'].map((id) =>
              Number.parseFloat(getComputedStyle(document.getElementById(id)).paddingTop))
          );
          check.supportingSectionPadding = spacing;
          if (spacing.some((value) => !Number.isFinite(value) || Math.abs(value - spacing[0]) > 1)) {
            check.errors.push('About supporting sections have inconsistent vertical padding');
          }
        }
        if ((width === 390 || width === 1280) && key === 'community') {
          const spacing = await page.locator('main .ui-section-space').evaluateAll((elements) =>
            elements.map((element) => Number.parseFloat(getComputedStyle(element).paddingTop))
          );
          check.supportingSectionPadding = spacing;
          if (spacing.length !== 2 || spacing.some((value) => !Number.isFinite(value) || Math.abs(value - spacing[0]) > 1)) {
            check.errors.push('Community supporting sections should share normal vertical spacing');
          }
        }

        if ((width === 390 || width === 1280) && key === 'directory') {
          const cards = page.locator('main a[data-ui-card="navigation"]');
          const total = await cards.count();
          check.navigationCardCount = total;
          if (total !== 6) check.errors.push('Directory must show six navigation destinations');
          const headings = await page.locator('main h2.type-section').count();
          if (headings < 1) check.errors.push('Directory needs a section heading for its h3 card titles');
        }
        if ((width === 390 || width === 1280) && key === 'stories') {
          const resultsExist = await page.locator('#story-grid').count() > 0;
          const highlight = await page.locator('main [data-ui-panel="highlight"]').count();
          check.storyComingSoonHighlight = highlight;
          if (highlight !== (resultsExist ? 0 : 1)) {
            check.errors.push('Stories must use HighlightPanel only for the coming-soon state');
          }
        }

        if (width === 390 && key === 'places') {
          const snapshot = () => page.evaluate(() => {
            const cards = [...document.querySelectorAll('#places-grid .place-card')];
            const shown = cards.filter((card) => !card.classList.contains('hidden'));
            return {
              total: cards.length,
              shown: shown.length,
              count: document.querySelector('#place-count')?.textContent?.trim(),
              empty: !document.querySelector('#places-empty')?.classList.contains('hidden'),
              nonArticles: cards.filter((card) => card.tagName !== 'ARTICLE' ||
                card.getAttribute('data-ui-card') !== 'result' ||
                !card.dataset.placeId || !card.dataset.search ||
                !card.querySelector('a[href*="google.com/maps/"]') ||
                !card.querySelector('a[href^="http"]')).length,
              invalidCategory: shown.some((card) => card.dataset.category !==
                document.querySelector('[data-category-filters] [aria-pressed="true"]')?.dataset.category &&
                document.querySelector('[data-category-filters] [aria-pressed="true"]')?.dataset.category !== '')
            };
          });
          const initial = await snapshot();
          check.placeResultCount = initial.total;
          if (initial.total < 1 || initial.shown !== initial.total ||
              initial.count !== String(initial.total) || initial.nonArticles || initial.empty) {
            check.errors.push('Places ResultCard output lost filter data, independent links or initial result count');
          }

          await page.locator('#place-search').fill('____ppi_no_matching_place_2026____');
          const none = await snapshot();
          if (none.shown !== 0 || none.count !== '0' || !none.empty) {
            check.errors.push('Places search does not expose a correct empty state');
          }

          await page.locator('#place-search').fill('');
          const category = page.locator('[data-category-filters] button[data-category]:not([data-category=""])').first();
          const selected = await category.getAttribute('data-category');
          await category.click();
          const filtered = await snapshot();
          if (!selected || filtered.shown < 1 || filtered.invalidCategory ||
              filtered.count !== String(filtered.shown)) {
            check.errors.push('Places category filter not consistent with ResultCard data attributes');
          }
          await page.locator('[data-category-filters] button[data-category=""]').click();
          const restored = await snapshot();
          if (restored.shown !== initial.total || restored.count !== String(initial.total)) {
            check.errors.push('Places category reset did not restore all result cards');
          }
          check.finderInteractions = 'places search, empty-state, category and restore checked';
        }

        // Advisory status is shown as a note with its own action, not a
        // whole-surface link, while published stories use semantic result cards.
        if ((width === 390 || width === 1280) && key === 'programs') {
          const panel = page.locator('main [data-ui-panel="advisory"]');
          const total = await panel.count();
          check.advisoryPanelCount = total;
          if (total !== 1) {
            check.errors.push('Programs must show one standard status advisory');
          } else {
            const state = await panel.first().evaluate((node) => ({
              tag: node.tagName.toLowerCase(),
              role: node.getAttribute('role'),
              tone: node.getAttribute('data-tone'),
              text: node.textContent || '',
              cta: node.querySelector('a[href*="/about/"]') !== null,
              style: getComputedStyle(node).backgroundColor
            }));
            if (state.tag !== 'div' || state.role !== 'note' || state.tone !== 'info'
                || !state.text.includes('Program dan jadwal resmi')
                || !state.cta || !state.style) {
              check.errors.push('Programs advisory is missing status, independent action, or visual style');
            }
          }
        }
        if ((width === 390 || width === 1280) && key === 'stories') {
          const entries = await page.locator('.story-entry').count();
          const resultCards = await page.locator('.story-entry article[data-ui-card="result"]').count();
          check.storyResultCards = resultCards;
          if (entries !== resultCards) {
            check.errors.push('Each published story must have a semantic result-card surface');
          }
        }

        // Shared highlight panels must render exactly once on both Landing
        // pages and keep their visual treatment aligned at phone/desktop width.
        if ((width === 390 || width === 1280) && (key === 'about' || key === 'community')) {
          const panels = page.locator('main [data-ui-panel="highlight"]');
          const total = await panels.count();
          check.highlightPanelCount = total;
          if (total !== 1) check.errors.push('Expected one shared highlight panel, got ' + total);
          if (total === 1) {
            const props = await panels.first().evaluate((element) => {
              const css = getComputedStyle(element);
              return { radius: css.borderRadius, padding: css.paddingLeft, background: css.backgroundColor };
            });
            check.highlightPanelStyle = props;
            if (!props.radius || !props.background || !props.padding) {
              check.errors.push('Highlight panel has incomplete computed visual style');
            }
          }
        }

        // Navigation cards keep a consistent interactive surface across Landing
        // destinations. Check both mobile and desktop without assuming content is identical.
        if ((width === 390 || width === 1280) && (key === 'about' || key === 'community')) {
          const cards = page.locator('main a[data-ui-card="navigation"]');
          const total = await cards.count();
          const expected = key === 'about' ? 7 : 5;
          check.navigationCardCount = total;
          if (total !== expected) check.errors.push('Expected ' + expected + ' shared navigation cards; found ' + total);
          const invalid = await cards.evaluateAll((links) => links.filter((link) =>
            link.querySelectorAll('h3').length !== 1 ||
            !link.getAttribute('href')?.startsWith('/ppi-ishikawa/') ||
            !link.classList.contains('ui-radius-card') ||
            !link.classList.contains('ui-border-subtle')
          ).length);
          if (invalid) check.errors.push(invalid + ' navigation cards violate heading, route, or visual contract');
        }
        if ((width === 390 || width === 1280) && (key === 'scholarships' || key === 'career')) {
          const isScholarship = key === 'scholarships';
          const root = isScholarship ? '#scholarship-grid' : '#career-grid';
          const selector = isScholarship ? '.scholarship-card' : '.career-source';
          const expectedAttributes = isScholarship
            ? ['campus', 'campusScope', 'level', 'stage', 'indonesia', 'route', 'freshness']
            : ['type', 'location', 'audience'];
          const details = await page.locator(root + ' ' + selector).evaluateAll((cards, attributes) => ({
            total: cards.length,
            invalidSemantics: cards.filter((card) =>
              card.tagName !== 'ARTICLE' ||
              card.dataset.uiCard !== 'result' ||
              attributes.some((attribute) => !(attribute in card.dataset))
            ).length,
            linked: cards.filter((card) => card.querySelector('a[href]')).length,
          }), expectedAttributes);
          check.primaryFinderResults = details;
          if (details.total < 1 || details.invalidSemantics) {
            check.errors.push(key + ': results lost article semantics or filter data attributes');
          }
          // sourceUrl is optional in scholarship data; do not invent links.
          // Career data must still retain an independent link on each result.
          if (details.linked < 1 || (!isScholarship && details.linked !== details.total)) {
            check.errors.push(key + ': available official source links were not retained');
          }
        }

        // Exercise the real Finder interactions once at a representative phone width.
        // These assertions supplement the screenshot/overflow checks, rather than
        // treating a successful static render as proof the filters still work.
        if (width === 390 && key === 'scholarships') {
          const snapshot = () => page.evaluate(() => {
            const cards = [...document.querySelectorAll('.scholarship-card')];
            const shown = cards.filter((card) => !card.classList.contains('hidden'));
            const stage = document.querySelector('#filter-stage')?.value || '';
            const route = document.querySelector('#filter-route')?.value || '';
            const matched = cards.filter((card) =>
              (!stage || (card.dataset.stage || '').split(',').some((value) => value === stage || value === 'both'))
              && (!route || card.dataset.route === route)
            );
            const countText = document.querySelector('#scholarship-count')?.textContent?.trim() || '';
            const emptyShown = !document.querySelector('#scholarship-empty')?.classList.contains('hidden');
            const moreShown = !document.querySelector('#scholarship-more')?.classList.contains('hidden');
            return {
              total: cards.length, shown: shown.length, stage, route, matched: matched.length,
              countText, emptyShown, moreShown,
              invalidShown: shown.some((card) => !matched.includes(card))
            };
          });
          const verify = (state, expectedShown, expectedMatched, label) => {
            if (state.shown !== expectedShown || state.countText !==
                'Menampilkan ' + expectedShown + ' dari ' + expectedMatched + ' beasiswa') {
              check.errors.push(label + ': displayed count does not match pagination/filter state');
            }
            if (state.invalidShown) check.errors.push(label + ': non-matching scholarship was displayed');
            if (state.moreShown !== (expectedMatched > expectedShown)) {
              check.errors.push(label + ': show-more visibility does not match remaining results');
            }
            if (state.emptyShown !== (expectedMatched === 0)) {
              check.errors.push(label + ': empty-state visibility mismatch');
            }
          };

          const initial = await snapshot();
          verify(initial, Math.min(4, initial.total), initial.total, 'default');
          if (initial.total > 4) {
            await page.locator('#scholarship-show-more').click();
            verify(await snapshot(), Math.min(8, initial.total), initial.total, 'show-more');
          }

          await page.locator('[data-stage-jump="before-arrival"]').click();
          await page.waitForFunction(() => {
            const cards = [...document.querySelectorAll('.scholarship-card')];
            const relevant = cards.filter((card) =>
              (card.dataset.stage || '').split(',').some((value) => value === 'before-arrival' || value === 'both')
            ).length;
            const shown = cards.filter((card) => !card.classList.contains('hidden')).length;
            return document.querySelector('#filter-stage')?.value === 'before-arrival'
              && shown === Math.min(4, relevant)
              && document.querySelector('#scholarship-count')?.textContent?.trim() ===
                'Menampilkan ' + shown + ' dari ' + relevant + ' beasiswa';
          }, null, { timeout: 4000 });
          const filtered = await snapshot();
          if (filtered.stage !== 'before-arrival') check.errors.push('stage shortcut did not update filter');
          verify(filtered, Math.min(4, filtered.matched), filtered.matched, 'stage shortcut');
          if (filtered.matched > 4) {
            await page.locator('#scholarship-show-more').click();
            verify(await snapshot(), Math.min(8, filtered.matched), filtered.matched, 'filtered show-more');
          }

          // A synthetic unmatched select option validates the empty-state and reset
          // without relying on any particular scholarship dataset composition.
          await page.locator('#filter-route').evaluate((select) => {
            select.add(new Option('Tidak ada hasil (tes)', '__no_match__'));
          });
          await page.locator('#filter-route').selectOption('__no_match__');
          const noMatches = await snapshot();
          verify(noMatches, 0, 0, 'no matches');
          await page.locator('#filter-reset').click();
          const reset = await snapshot();
          if (reset.stage || reset.route) check.errors.push('Reset did not clear scholarship filters');
          verify(reset, Math.min(4, initial.total), initial.total, 'reset');
          check.finderInteractions = 'scholarship pagination, shortcut, empty state and reset passed';
        }
        if (width === 390 && key === 'career') {
          const navigationBeforeResults = await page.evaluate(() => {
            const nav = document.querySelector('nav[aria-label="Navigasi Karier"]');
            const grid = document.querySelector('#career-grid');
            return Boolean(nav && grid && (nav.compareDocumentPosition(grid) & Node.DOCUMENT_POSITION_FOLLOWING));
          });
          if (!navigationBeforeResults) check.errors.push('Career section nav must precede result list');
          const initial = await page.locator('.career-source').count();
          const selected = await page.locator('#career-type').selectOption({ index: 1 });
          await page.waitForFunction((type) => {
            const visible = [...document.querySelectorAll('.career-source')]
              .filter((card) => !card.classList.contains('hidden'));
            return visible.every((card) => (card.dataset.type || '').split(',').includes(type))
              && document.querySelector('#career-count')?.textContent?.trim() ===
                visible.length + ' sumber ditampilkan';
          }, selected[0], { timeout: 4000 });
          await page.locator('#career-reset').click();
          await page.waitForFunction((total) =>
            document.querySelector('#career-type')?.value === ''
            && [...document.querySelectorAll('.career-source')]
              .filter((card) => !card.classList.contains('hidden')).length === total,
          initial, { timeout: 4000 });
          check.finderInteractions = 'career filter + reset passed';
        }
        if (check.default.smallTargets.length) {
          check.warnings.push(check.default.smallTargets.length + ' header/footer targets below 40px; inspect report');
        }
      } catch (error) {
        check.errors.push(String(error?.message || error).slice(0, 250));
      }
      failures += check.errors.length;
      report.checks.push(check);
      console.log((check.errors.length ? 'FAIL' : 'PASS') + ' ' + width + ' ' + pathname +
        (check.default ? ' scrollWidth=' + check.default.scrollWidth : '') +
        (check.errors.length ? ' errors=' + check.errors.join(' | ') : ''));
    }
    await page.close();
  }
} finally {
  await browser.close();
  report.summary = {
    cases: report.checks.length,
    failures,
    totalOverflowCases: report.checks.filter((item) => item.default?.overflowPx > 2).length,
    screenshots: report.checks.filter((item) => item.screenshot).length
  };
  await writeFile(path.join(outputDir, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log('RESPONSIVE SUMMARY ' + JSON.stringify(report.summary));
}
if (failures) process.exitCode = 1;
