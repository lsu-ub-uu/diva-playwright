import { expect } from '@playwright/test';
import { test } from './util/fixtures';
import { createUrl } from './util/createUrl';
import {
  getFirstDataAtomicValueWithNameInData,
  getFirstDataGroupWithNameInData,
} from './util/coraUtils';

const { BASE_URL } = process.env;

const escapedBaseUrl = (BASE_URL ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test.describe('SEO', () => {
  test('Should render robots.txt', async ({ page }) => {
    const response = await page.goto(createUrl('/robots.txt'));
    if (!response) throw new Error('No response received for /robots.txt');
    const content = await response.text();

    expect(content).toMatch(
      new RegExp(
        [
          'User-agent: \\*\\s*',
          'Allow: /divaclient\\s*',
          'Disallow: /\\s*',
          'Sitemap: .*/divaclient/sitemap\\.xml',
        ].join(''),
      ),
    );
  });

  test('Should render sitemap.xml', async ({ page, divaOutput }) => {
    const response = await page.goto(createUrl('/sitemap.xml'));
    if (!response) throw new Error('No response received for /sitemap.xml');
    const content = await response.text();

    const recordInfo = getFirstDataGroupWithNameInData(
      divaOutput,
      'recordInfo',
    );
    const recordId = getFirstDataAtomicValueWithNameInData(recordInfo, 'id');
    const updated = getFirstDataGroupWithNameInData(recordInfo, 'updated');
    const tsUpdated = getFirstDataAtomicValueWithNameInData(
      updated,
      'tsUpdated',
    );
    const tsUpdatedMillis = tsUpdated.replace(/(\.\d{3})\d*Z$/, '$1Z');

    expect(content).toMatch(
      new RegExp(
        [
          `<\\?xml version="1\\.0" encoding="UTF-8"\\?>\\s*`,
          `<urlset xmlns="http://www\\.sitemaps\\.org/schemas/sitemap/0\\.9">\\s*`,
          `<url>\\s*<loc>.*${escapedBaseUrl}?</loc>\\s*</url>\\s*`,
          `<url>\\s*<loc>.*${escapedBaseUrl}?/diva-output</loc>\\s*</url>\\s*`,
          `<url>\\s*<loc>.*${escapedBaseUrl}?/diva-person</loc>\\s*</url>\\s*`,
          `<url>\\s*<loc>.*${escapedBaseUrl}?/diva-project</loc>\\s*</url>\\s*`,
          `(?:<url>[\\s\\S]*?</url>\\s*)*`,
          `<url>\\s*`,
          `<loc>.*${escapedBaseUrl}?/diva-output/${recordId}</loc>\\s*`,
          `<lastmod>${tsUpdatedMillis}</lastmod>\\s*`,
          `<changefreq>yearly</changefreq>\\s*`,
          `</url>\\s*`,
          `</urlset>`,
        ].join(''),
      ),
    );
  });
});
