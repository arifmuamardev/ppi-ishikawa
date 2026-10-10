import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

// Separate browser QA for the noindex, isolated public Design Lab.
// Usage: npm run build && npm run preview -- --host 127.0.0.1 --port 4321
// Then: node scripts/audit-design-lab.mjs
const baseURL = (process.env.DESIGN_LAB_BASE_URL || 'http://127.0.0.1:4321/ppi-ishikawa').replace(/\/$/, '');
const widths = [360, 390, 768, 1280];
const directory = 'design-lab-audit/screenshots';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const failures = [];

function verify(condition, message, width) {
  if (!condition) failures.push(width + 'px: ' + message);
}

async function overflow(page) {
  return page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
}

try {
  for (const width of widths) {
    const page = await browser.newPage({
      viewport: { width, height: 850 }, deviceScaleFactor: 1, reducedMotion: 'reduce'
    });
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    try {
      const result = await page.goto(baseURL + '/design-lab/unnes-inspired/', { waitUntil: 'domcontentloaded', timeout: 30000 });
      verify(result?.status() === 200, 'Expected HTTP 200; got ' + result?.status(), width);
      await page.evaluate(() => document.fonts.ready);
      verify(await page.locator('h1').count() === 1, 'Design Lab should have one h1', width);
      verify(await page.locator('#preview').getAttribute('data-view') === 'b', 'Visual style B should be default', width);
      verify(await page.locator('[data-variant="b"]').getAttribute('aria-pressed') === 'true', 'B button must be pressed', width);
      verify(await page.locator('#preview').getAttribute('data-mode') === 'light', 'Light should be initial mode', width);
      verify((await overflow(page)) <= 2, 'Initial horizontal overflow', width);
      await page.screenshot({ path: directory + '/lab-light-' + width + '.jpg', type: 'jpeg', quality: 62, fullPage: true, animations: 'disabled' });



      // Spacing study should adjust layout rhythm without creating a fourth
      // page template, changing colors, or creating horizontal overflow.
      verify(await page.locator('#design-spacing').count() === 1,
        'Spacing & Grid section should be visible in the Design Lab', width);
      verify(await page.locator('body').getAttribute('data-layout-density') === 'balanced',
        'Balanced must be the default spacing preset', width);
      const readDensity = () => page.evaluate(() => {
        const style = (selector) => getComputedStyle(document.querySelector(selector));
        return {
          section: parseFloat(style('.preview-section').paddingTop),
          card: parseFloat(style('.cards .card').paddingTop),
          gap: parseFloat(style('.cards').columnGap),
          template: parseFloat(style('.ds-page:not([hidden])').paddingTop)
        };
      });
      const balanced = await readDensity();
      await page.locator('[data-spacing-choice="compact"]').click();
      verify(await page.locator('[data-spacing-choice="compact"]').getAttribute('aria-pressed') === 'true',
        'Compact selection should update accessible pressed state', width);
      const compact = await readDensity();
      await page.locator('[data-spacing-choice="spacious"]').click();
      const spacious = await readDensity();
      verify(compact.section < balanced.section && balanced.section < spacious.section,
        'Section spacing must follow Compact < Balanced < Spacious', width);
      verify(compact.card < balanced.card && balanced.card < spacious.card,
        'Card padding must follow Compact < Balanced < Spacious', width);
      verify(compact.gap < balanced.gap && balanced.gap < spacious.gap,
        'Grid spacing must follow Compact < Balanced < Spacious', width);
      verify(compact.template < balanced.template && balanced.template < spacious.template,
        'Template spacing must follow Compact < Balanced < Spacious', width);
      verify((await overflow(page)) <= 2, 'Spacious layout caused horizontal overflow', width);
      verify(await page.locator('#preview').getAttribute('data-view') === 'b',
        'Spacing control should preserve visual variant B', width);
      if (width === 390 || width === 1280) {
        await page.screenshot({path: directory + '/layout-spacious-' + width + '.jpg',
          type: 'jpeg', quality: 62, fullPage: true, animations: 'disabled'});
      }
      await page.reload({waitUntil:'domcontentloaded'});
      verify(await page.locator('body').getAttribute('data-layout-density') === 'spacious',
        'Spacing setting should survive reload', width);
      await page.locator('[data-spacing-choice="balanced"]').click();
      const restored = await readDensity();
      verify(Math.abs(restored.section - balanced.section) <= 1 &&
        Math.abs(restored.card - balanced.card) <= 1,
        'Balanced layout should be restored exactly', width);
      verify((await overflow(page)) <= 2, 'Balanced layout caused horizontal overflow', width);

      // Contour design study must remain decorative and independently adjustable.
      const contours = page.locator('.ppi-contour, .ppi-map');
      verify(await page.locator('.ppi-contour').count() === 10, 'Expected ten original line motifs (including comparison)', width);
      verify(await page.locator('.ppi-map').count() === 10, 'Expected ten Ishikawa outline motifs (including comparison)', width);
      // Each decorative placement should reference one of three *open* fragments.
      // A full, closed map outline must never be repeated as the page ornament.
      for (const [kind, count] of [['hero',4], ['corner',3], ['ribbon',3]]) {
        const group = page.locator('#ppi-ishikawa-fragment-' + kind);
        verify(await group.count() === 1, kind + ' fragment group missing', width);
        const detail = await group.locator('path').evaluateAll((paths) => ({
          count: paths.length,
          closed: paths.some((node) => /z\s*$/i.test(node.getAttribute('d') || '')),
          notCurved: paths.some((node) => !(node.getAttribute('d') || '').includes(' C')),
          thick: paths.some((node) => Number(node.getAttribute('stroke-width')) > 1),
          scaling: paths.some((node) => node.getAttribute('vector-effect') !== 'non-scaling-stroke')
        }));
        verify(detail.count === count && !detail.closed && !detail.notCurved && !detail.thick && !detail.scaling,
          'Fragments should be open, curved, thin, non-scaling paths: ' + kind + ' ' + JSON.stringify(detail), width);
      }
      const placements = {
        hero:'hero',art:'hero',section:'corner',cta:'ribbon',footer:'ribbon',guide:'corner'
      };
      for (const [slot, kind] of Object.entries(placements)) {
        const href = await page.locator('.ppi-map--' + slot + ' use').getAttribute('href');
        verify(href === '#ppi-ishikawa-fragment-' + kind, 'Wrong fragment in ' + slot + ': ' + href, width);
      }
      const samples = await page.locator('.contour-sample .ppi-map use').evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute('href')));
      verify(JSON.stringify(samples) === JSON.stringify([
        '#ppi-ishikawa-fragment-hero','#ppi-ishikawa-fragment-corner','#ppi-ishikawa-fragment-ribbon'
      ]), 'Three gallery samples should show three distinct coastal fragments', width);
      verify(await page.locator('g#ppi-ishikawa-map').count() === 0,
        'The full map should not be embedded in preview', width);
      verify(await page.locator('body').getAttribute('data-contour-motif') === 'map', 'Ishikawa should be the initial motif', width);
      const mapAsset = await page.request.get(baseURL + '/design-lab/unnes-inspired/ishikawa-outline.svg');
      const mapSvg = await mapAsset.text();
      verify(mapAsset.ok() && mapSvg.includes('viewBox="1159.74 1083.45 90.81 139.84"') &&
        mapSvg.includes('M1192.40') && mapSvg.includes('stroke-width="0.95"'),
        'Downloadable smoothed thin outline SVG unavailable or outdated', width);
      const licenseAsset = await page.request.get(baseURL + '/design-lab/unnes-inspired/LICENSE-ishikawa-map.txt');
      verify(licenseAsset.ok() && (await licenseAsset.text()).includes('MIT License'), 'Map attribution/license unavailable', width);
      verify(await page.locator('symbol#ppi-contour-mark').count() === 1, 'Reusable SVG contour symbol missing', width);
      const contourLogo = page.locator('.contour-logo img');
      await contourLogo.scrollIntoViewIfNeeded({ timeout: 10000 });
      await page.waitForFunction(() => { const img = document.querySelector('.contour-logo img'); return img && img.complete && img.naturalWidth > 0; }, null, { timeout: 15000 });
      verify(await contourLogo.evaluate((img) => img.naturalWidth > 0), 'Reference logo asset failed to load', width);
      const motifSemantics = await contours.evaluateAll((nodes) =>
        nodes.every((node) => node.getAttribute('aria-hidden') === 'true' &&
          node.getAttribute('focusable') === 'false' && getComputedStyle(node).pointerEvents === 'none')
      );
      verify(motifSemantics, 'Decorative contours should be non-interactive and hidden to assistive technology', width);
      const stroke = () => page.locator('.ppi-map--hero').evaluate((node) => getComputedStyle(node).opacity);
      verify(await page.locator('.ppi-map--hero').isVisible(), 'Initial map SVG container should be visible', width);
      // isVisible() alone is insufficient: an SVG can exist while its strokes are clipped
      // and drew the path completely outside the viewport.
      const shapeGeometry = await page.locator('.ppi-map--hero').evaluate((svg) => {
        const bbox = svg.querySelector('use').getBBox();
        const frame = svg.viewBox.baseVal;
        const intersectW = Math.max(0, Math.min(bbox.x + bbox.width, frame.x + frame.width) - Math.max(bbox.x, frame.x));
        const intersectH = Math.max(0, Math.min(bbox.y + bbox.height, frame.y + frame.height) - Math.max(bbox.y, frame.y));
        const visibleRatio = bbox.width * bbox.height ? (intersectW * intersectH)/(bbox.width * bbox.height) : 0;
        return { visibleRatio, bbox: [bbox.x, bbox.y, bbox.width, bbox.height], frame: [frame.x, frame.y, frame.width, frame.height] };
      });
      verify(shapeGeometry.visibleRatio > .95, 'Ishikawa path lies outside SVG viewBox: ' + JSON.stringify(shapeGeometry), width);
      verify(await page.locator('.ppi-map--art').isVisible(), 'Ishikawa outline must appear on the red identity panel', width);
      verify(Number(await page.locator('.ppi-map--art').evaluate((n) => getComputedStyle(n).opacity)) >= .33,
        'Map in hero identity panel too faint in default Subtle mode', width);
      await page.locator('[data-motif-choice="lines"]').click();
      verify(await page.locator('body').getAttribute('data-contour-motif') === 'lines', 'Old motif not selected', width);
      verify(await page.locator('.ppi-contour--hero').isVisible(), 'Original line contour should show', width);
      verify(!(await page.locator('.ppi-map--hero').isVisible()), 'Map should hide in line mode', width);
      await page.locator('[data-motif-choice="map"]').click();
      verify(await page.locator('.ppi-map--hero').isVisible(), 'Map outline should show again', width);
      verify(!(await page.locator('.ppi-contour--hero').isVisible()), 'Original motif should hide in map mode', width);
      verify(Number(await stroke()) >= .33 && Number(await stroke()) <= .39,
        'Subtle fragment opacity should stay decorative and restrained', width);
      await page.locator('[data-contour-choice="off"]').click();
      verify(await page.locator('body').getAttribute('data-contour-strength') === 'off', 'Off contour mode did not apply', width);
      verify(Number(await stroke()) === 0, 'Off contour should be fully hidden', width);
      await page.locator('[data-contour-choice="strong"]').click();
      verify(Number(await stroke()) >= .59 && Number(await stroke()) <= .63,
        'Strong fragment opacity should remain refined', width);
      await page.reload({ waitUntil: 'domcontentloaded' });
      verify(await page.locator('body').getAttribute('data-contour-strength') === 'strong', 'Contour choice did not persist', width);
      verify(await page.locator('body').getAttribute('data-contour-motif') === 'map', 'Map motif did not persist', width);
      await page.locator('[data-contour-choice="subtle"]').click();
      verify((await overflow(page)) <= 2, 'Contour study caused horizontal overflow', width);
      await page.screenshot({path: directory + '/fragments-subtle-' + width + '.jpg', type: 'jpeg', quality: 62, fullPage: true, animations: 'disabled'});
      await page.locator('[data-motif-choice="lines"]').click();
      await page.screenshot({path: directory + '/abstract-subtle-' + width + '.jpg', type: 'jpeg', quality: 62, fullPage: true, animations: 'disabled'});
      await page.locator('[data-motif-choice="map"]').click();


      // Flat vs Soft Elevation: verify computed depth, interactivity and persisted choice.
      const getShadow = async (selector) => page.locator(selector).first().evaluate(
        (node) => getComputedStyle(node).boxShadow
      );
      verify(await page.locator('body').getAttribute('data-elevation') === 'soft',
        'Soft Elevation should be the initial shadow mode', width);
      verify(await page.locator('#design-shadow').count() === 1,
        'Shadow study section missing', width);
      verify(await getShadow('.browser') !== 'none',
        'Soft mode should keep a restrained browser-frame shadow', width);
      verify(await getShadow('.ds-frame') !== 'none',
        'Soft mode should give the template frame slight depth', width);
      verify(await getShadow('.ds-result-card') === 'none',
        'Result cards must remain flat in Soft mode', width);
      verify(await getShadow('.ds-notice') === 'none',
        'Advisory panels must remain flat in Soft mode', width);
      const navShadowDemo = page.locator('a[data-shadow-surface="navigation"]');
      await navShadowDemo.scrollIntoViewIfNeeded();
      await navShadowDemo.hover();
      verify(await getShadow('a[data-shadow-surface="navigation"]') !== 'none',
        'Navigation hover should gain subtle elevation in Soft mode', width);
      verify(await navShadowDemo.getAttribute('href') === '#design-templates',
        'Navigation shadow demo should be a functional link', width);
      await page.locator('#shadow-dropdown summary').click();
      verify(await page.locator('#shadow-dropdown').evaluate((el) => el.open),
        'Dropdown must open by user interaction', width);
      verify(await getShadow('.shadow-dropdown-panel') !== 'none',
        'Floating dropdown must cast a distinct shadow in Soft mode', width);
      await page.screenshot({path: directory + '/shadow-soft-' + width + '.jpg',
        type: 'jpeg', quality: 62, fullPage: true, animations: 'disabled'});
      await page.locator('[data-shadow-choice="flat"]').click();
      verify(await page.locator('body').getAttribute('data-elevation') === 'flat',
        'Flat shadow mode did not activate', width);
      verify(await page.locator('[data-shadow-choice="flat"]').getAttribute('aria-pressed') === 'true',
        'Flat shadow toggle should announce its state', width);
      for (const selector of ['.browser','.ds-frame','.ds-result-card','.shadow-dropdown-panel']) {
        verify(await getShadow(selector) === 'none',
          'Flat mode should remove shadow on ' + selector, width);
      }
      verify(await getShadow('.shadow-example-soft') !== 'none',
        'Side-by-side elevation reference should always show its comparison example', width);
      await page.screenshot({path: directory + '/shadow-flat-' + width + '.jpg',
        type: 'jpeg', quality: 62, fullPage: true, animations: 'disabled'});
      await page.locator('[data-shadow-choice="soft"]').click();
      verify(await page.locator('body').getAttribute('data-elevation') === 'soft',
        'Soft elevation cannot be restored after flat', width);
      await page.reload({ waitUntil: 'domcontentloaded' });
      verify(await page.locator('body').getAttribute('data-elevation') === 'soft',
        'Shadow selection did not persist after reload', width);
      verify((await overflow(page)) <= 2, 'Shadow study caused horizontal overflow', width);

      await page.locator('[data-mode-choice="dark"]').click();
      verify(await page.locator('#preview').getAttribute('data-mode') === 'dark', 'Dark preview mode not applied', width);
      verify(await page.locator('body').getAttribute('data-lab-theme') === 'dark', 'Dark global lab background not applied', width);
      verify(await page.locator('[data-mode-choice="dark"]').getAttribute('aria-pressed') === 'true', 'Dark mode toggle not selected', width);
      verify((await overflow(page)) <= 2, 'Dark mode overflow', width);
      await page.screenshot({ path: directory + '/lab-dark-' + width + '.jpg', type: 'jpeg', quality: 62, fullPage: true, animations: 'disabled' });
      await page.reload({ waitUntil: 'domcontentloaded' });
      verify(await page.locator('#preview').getAttribute('data-mode') === 'dark', 'Dark mode did not persist after reload', width);
      await page.locator('[data-mode-choice="light"]').click();

      for (const visual of ['a', 'c', 'b']) {
        await page.locator('[data-variant="' + visual + '"]').click();
        verify(await page.locator('#preview').getAttribute('data-view') === visual, 'Visual variant ' + visual + ' did not activate', width);
      }

      for (const template of ['finder', 'guide', 'landing']) {
        await page.locator('[data-page-choice="' + template + '"]').click();
        verify(await page.locator('[data-page="' + template + '"]').isVisible(), 'Template ' + template + ' not visible', width);
        const shown = await page.locator('.ds-page:not([hidden])').count();
        verify(shown === 1, 'Expected exactly one visible template, got ' + shown, width);
      }

      for (const device of ['mobile', 'tablet', 'desktop']) {
        await page.locator('[data-width-choice="' + device + '"]').click();
        verify(await page.locator('#ds-template-frame').getAttribute('data-viewport') === device, 'Viewport choice ' + device + ' did not activate', width);
        if (device === 'mobile') {
          const frameWidth = await page.locator('#ds-template-frame').evaluate((node) => node.getBoundingClientRect().width);
          verify(frameWidth <= 392, 'Simulated mobile content is wider than 390px', width);
        }
      }
      verify((await overflow(page)) <= 2, 'Template toggles caused horizontal overflow', width);

      await page.locator('[data-page-choice="finder"]').click();
      verify(await page.locator('.ds-find-result:visible').count() === 2, 'Finder should initially reveal two results', width);
      await page.locator('#ds-find-more').click();
      verify(await page.locator('.ds-find-result:visible').count() === 4, 'Show-more must reveal all matching results', width);
      await page.locator('#ds-find-category').selectOption('beasiswa');
      verify(await page.locator('.ds-find-result:visible').count() === 1, 'Category filter mismatch', width);
      await page.locator('#ds-find-query').fill('unlikely-to-match-2026');
      verify(await page.locator('.ds-find-result:visible').count() === 0, 'Empty state should hide results', width);
      verify(await page.locator('#ds-find-empty').isVisible(), 'Empty-state message missing', width);
      await page.locator('#ds-find-reset').click();
      verify(await page.locator('.ds-find-result:visible').count() === 2, 'Reset should restore the initial two results', width);

      await page.locator('#ds-name').fill('Uji Desain');
      await page.locator('#ds-topic').selectOption('Kampus');
      await page.locator('#ds-sample-form button[type="submit"]').click();
      verify((await page.locator('#ds-form-feedback').innerText()).includes('Tidak ada data yang dikirim'), 'Local form feedback not shown', width);
      await page.locator('#ds-checklist input').first().check();
      verify((await page.locator('#ds-qa-count').innerText()).startsWith('1 dari 6'), 'Checklist count did not update', width);

      const linkCheck = await page.evaluate(() => ({
        broken: [...document.querySelectorAll('a[href^="#"]')]
          .filter((link) => !document.getElementById(decodeURIComponent(link.hash.slice(1))))
          .map((link) => link.getAttribute('href')),
        templateSourcesFirst: Boolean(
          document.getElementById('ds-guide-evidence')?.compareDocumentPosition(
            document.querySelector('.ds-guide-next')
          ) & Node.DOCUMENT_POSITION_FOLLOWING
        ),
      }));
      verify(linkCheck.broken.length === 0, 'Broken internal anchors: ' + linkCheck.broken.join(', '), width);
      verify(linkCheck.templateSourcesFirst, 'Guide must show sources before final navigation', width);
      verify(pageErrors.length === 0, 'Uncaught JS exceptions: ' + pageErrors.join('; '), width);
      console.log('PASS ' + width + 'px — theme, visual B, template A/B/C, responsive, Finder, form, governance');
    } catch (error) {
      failures.push(width + 'px: ' + error.message);
      console.error('FAIL ' + width + 'px: ' + error.message);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error('Design Lab audit failed:\n' + failures.map((error) => '- ' + error).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Design Lab passed ' + widths.length + ' screen widths in Chromium.');
}
