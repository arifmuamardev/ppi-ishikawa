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
  ['life-in-ishikawa', '/life-in-ishikawa/'],
  ['contact', '/contact/'],
  ['member', '/member/'],
  ['family', '/life-in-ishikawa/family-anak/'],
  ['family-starter', '/life-in-ishikawa/family/starter-pack/'],
  ['family-timeline', '/life-in-ishikawa/family/timeline/'],
  ['campus', '/community/kampus/'],
  ['campus-kanazawa', '/community/kampus/kanazawa-university/'],
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
            !link.classList.contains('rounded-2xl')
          ).length);
          if (invalid) check.errors.push(invalid + ' navigation cards violate heading, route, or visual contract');
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
