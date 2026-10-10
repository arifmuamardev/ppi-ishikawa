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


      // Contour design study must remain decorative and independently adjustable.
      const contours = page.locator('.ppi-contour, .ppi-map');
      verify(await page.locator('.ppi-contour').count() === 10, 'Expected ten original line motifs (including comparison)', width);
      verify(await page.locator('.ppi-map').count() === 10, 'Expected ten Ishikawa outline motifs (including comparison)', width);
      verify(await page.locator('symbol#ppi-ishikawa-map').count() === 1, 'Geographic outline symbol missing', width);
      verify(await page.locator('body').getAttribute('data-contour-motif') === 'map', 'Ishikawa should be the initial motif', width);
      const mapAsset = await page.request.get(baseURL + '/design-lab/unnes-inspired/ishikawa-outline.svg');
      verify(mapAsset.ok() && (await mapAsset.text()).includes('viewBox="1159.74 1083.45 90.81 139.84"'), 'Downloadable boundary SVG unavailable', width);
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
      verify(await page.locator('.ppi-map--hero').isVisible(), 'Initial map outline should be visible', width);
      await page.locator('[data-motif-choice="lines"]').click();
      verify(await page.locator('body').getAttribute('data-contour-motif') === 'lines', 'Old motif not selected', width);
      verify(await page.locator('.ppi-contour--hero').isVisible(), 'Original line contour should show', width);
      verify(!(await page.locator('.ppi-map--hero').isVisible()), 'Map should hide in line mode', width);
      await page.locator('[data-motif-choice="map"]').click();
      verify(await page.locator('.ppi-map--hero').isVisible(), 'Map outline should show again', width);
      verify(!(await page.locator('.ppi-contour--hero').isVisible()), 'Original motif should hide in map mode', width);
      verify(Number(await stroke()) > 0, 'Subtle contour should be visible', width);
      await page.locator('[data-contour-choice="off"]').click();
      verify(await page.locator('body').getAttribute('data-contour-strength') === 'off', 'Off contour mode did not apply', width);
      verify(Number(await stroke()) === 0, 'Off contour should be fully hidden', width);
      await page.locator('[data-contour-choice="strong"]').click();
      verify(Number(await stroke()) >= .5, 'Strong contour should increase intensity', width);
      await page.reload({ waitUntil: 'domcontentloaded' });
      verify(await page.locator('body').getAttribute('data-contour-strength') === 'strong', 'Contour choice did not persist', width);
      verify(await page.locator('body').getAttribute('data-contour-motif') === 'map', 'Map motif did not persist', width);
      await page.locator('[data-contour-choice="subtle"]').click();
      verify((await overflow(page)) <= 2, 'Contour study caused horizontal overflow', width);
      await page.screenshot({path: directory + '/map-subtle-' + width + '.jpg', type: 'jpeg', quality: 62, fullPage: true, animations: 'disabled'});
      await page.locator('[data-motif-choice="lines"]').click();
      await page.screenshot({path: directory + '/abstract-subtle-' + width + '.jpg', type: 'jpeg', quality: 62, fullPage: true, animations: 'disabled'});
      await page.locator('[data-motif-choice="map"]').click();

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
