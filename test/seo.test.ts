import { expect } from '@playwright/test';
import { test } from './util/fixtures';
import { createUrl } from './util/createUrl';
import { getFirstDataAtomicValueWithNameInData, getFirstDataGroupWithNameInData } from './util/coraUtils';

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

  test('Should render sitemap.xml', async ({ page, divaOutput }) => {
    const response = await page.goto(createUrl('/sitemap.xml'));
    if (!response) throw new Error('No response received for /sitemap.xml');
    const content = await response.text();

    const recordInfo = getFirstDataGroupWithNameInData(divaOutput, 'recordInfo');
    const recordId = getFirstDataAtomicValueWithNameInData(
      recordInfo,
      'id',
    );
    const updated = getFirstDataGroupWithNameInData(recordInfo, 'updated');
    const tsUpdated = getFirstDataAtomicValueWithNameInData(
      updated,
      'tsUpdated',
    );
    const tsUpdatedMillis = tsUpdated.replace(/(\.\d{3})\d*Z$/, '$1Z');

    expect(content).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(content).toMatch(/<url>\s*<loc>.*(?:\/divaclient)?<\/loc>\s*<\/url>/);
    expect(content).toMatch(/<url>\s*<loc>.*(?:\/divaclient)?\/diva-output<\/loc>\s*<\/url>/);
    expect(content).toMatch(/<url>\s*<loc>.*(?:\/divaclient)?\/diva-person<\/loc>\s*<\/url>/);
    expect(content).toMatch(/<url>\s*<loc>.*(?:\/divaclient)?\/diva-project<\/loc>\s*<\/url>/);
    expect(content).toMatch(new RegExp(`<url>\\s*<loc>.*(?:/divaclient)?/diva-output/${recordId}</loc>`));
    expect(content).toContain(`<lastmod>${tsUpdatedMillis}</lastmod>`);
    expect(content).toMatch(/<changefreq>yearly<\/changefreq>/);
    expect(content).toContain('</urlset>');
  });
});