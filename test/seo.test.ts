import { expect } from '@playwright/test';
import { test } from './util/fixtures';
import { createUrl } from './util/createUrl';

test.describe('SEO', () => {
  test('Should render robots.txt', async ({ page }) => {
    const response = await page.goto(createUrl('/robots.txt'));
    if (!response) throw new Error('No response received for /robots.txt');
    const content = await response.text();

    expect(content).toContain('User-agent: *');
    expect(content).toContain('Allow: /divaclient');
    expect(content).toContain('Disallow: /');
    expect(content).toMatch(/Sitemap: .*\/divaclient\/sitemap\.xml/);
  });

  test('Should render sitemap.xml', async ({ page }) => {
    const response = await page.goto(createUrl('/sitemap.xml'));
    if (!response) throw new Error('No response received for /sitemap.xml');
    const content = await response.text();

    expect(content).toContain(`
  <urlset>
  <url>
  <loc>http://preview.diva.cora.epc.ub.uu.se</loc>
  </url>
  <url>
  <loc>http://preview.diva.cora.epc.ub.uu.se/diva-output</loc>
  </url>
  <url>
  <loc>http://preview.diva.cora.epc.ub.uu.se/diva-person</loc>
  </url>
  <url>
  <loc>http://preview.diva.cora.epc.ub.uu.se/diva-project</loc>
  </url>
  </urlset>`);
  });
});
