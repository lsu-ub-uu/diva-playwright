import { test as base, Locator, type Page } from '@playwright/test';
import { createDivaOutput } from '../testData/divaOutput';
import { createLocalGenericMarkup } from '../testData/localGenericMarkup';
import type { DataGroup } from './coraTypes';
import { getFirstDataAtomicValueWithNameInData } from './coraUtils';
import { addSubdomain } from './addSubdomain';
import fs from 'fs';
import path from 'path';

const { CORA_API_URL, CORA_LOGIN_URL, TARGET_URL, CORA_USER, CORA_APPTOKEN } =
  process.env;

interface CustomPage extends Page {
  getByDefinitionTerm: (dtText: string) => Locator;
}

interface Fixtures {
  page: CustomPage;
  authtoken: string;
  kthPage: Page;
  divaOutput: DataGroup;
  kthDivaOutput: DataGroup;
  uuLocalGenericMarkup: DataGroup;
  kthLocalGenericMarkup: DataGroup;
  ultimateDivaOutput: DataGroup;
}

export const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    await use(
      Object.assign(page, {
        getByDefinitionTerm: (dtText) =>
          page.locator(
            `xpath=//dt[contains(., '${dtText}')]/following-sibling::dd[preceding-sibling::dt[1][contains(., '${dtText}')]]`,
          ),
      }),
    );
  },

  authtoken: async ({ request }, use) => {
    const response = await request.post(`${CORA_LOGIN_URL}/apptoken`, {
      data: `${CORA_USER}\n${CORA_APPTOKEN}`,
      headers: {
        'Content-Type': 'application/vnd.cora.login',
      },
    });
    const { authentication } = await response.json();
    const token = getFirstDataAtomicValueWithNameInData(
      authentication.data,
      'token',
    );

    await use(token);

    await request.delete(authentication.actionLinks.delete.url, {
      headers: { Authtoken: token },
    });
  },

  divaOutput: async ({ request, authtoken }, use) => {
    const response = await request.post(`${CORA_API_URL}/record/diva-output`, {
      data: createDivaOutput(),
      headers: {
        Accept: 'application/vnd.cora.record+json',
        'Content-Type': 'application/vnd.cora.recordGroup+json',
        Authtoken: authtoken,
      },
    });

    if (!response.ok()) {
      throw new Error(`Failed to create diva output: ${await response.text()}`);
    }

    const responseBody = await response.json();

    await use(responseBody.record.data);

    await request.delete(responseBody.record.actionLinks.delete.url, {
      headers: { Authtoken: authtoken },
    });
  },

  ultimateDivaOutput: async ({ request, authtoken }, use) => {
    const xml = fs.readFileSync(
      path.join(__dirname, '../testData/ultimateDivaOutput.xml'),
      'utf-8',
    );

    const response = await request.post(`${CORA_API_URL}/record/diva-output`, {
      data: xml,
      headers: {
        Accept: 'application/vnd.cora.record+json',
        'Content-Type': 'application/vnd.cora.recordGroup+xml',
        Authtoken: authtoken,
      },
    });

    const responseBody = await response.json();

    await use(responseBody.record.data);

    await request.delete(responseBody.record.actionLinks.delete.url, {
      headers: { Authtoken: authtoken },
    });
  },

  kthDivaOutput: async ({ request, authtoken }, use) => {
    const response = await request.post(`${CORA_API_URL}/record/diva-output`, {
      data: createDivaOutput('kth'),
      headers: {
        Accept: 'application/vnd.cora.record+json',
        'Content-Type': 'application/vnd.cora.recordGroup+json',
        Authtoken: authtoken,
      },
    });
    const responseBody = await response.json();

    await use(responseBody.record.data);

    await request.delete(responseBody.record.actionLinks.delete.url, {
      headers: { Authtoken: authtoken },
    });
  },

  kthPage: async ({ browser }, use) => {
    // Set up
    const context = await browser.newContext({
      baseURL: addSubdomain(TARGET_URL!, 'kth'),
    });
    const page = await context.newPage();

    await use(page);

    // Clean up
    await page.close();
    await context.close();
  },

  uuLocalGenericMarkup: async ({ request, authtoken }, use) => {
    const response = await request.post(
      `${CORA_API_URL}/record/diva-localGenericMarkup`,
      {
        data: createLocalGenericMarkup('uu'),
        headers: {
          Accept: 'application/vnd.cora.record+json',
          'Content-Type': 'application/vnd.cora.recordGroup+json',
          Authtoken: authtoken,
        },
      },
    );

    const responseBody = await response.json();

    await use(responseBody.record.data);

    await request.delete(responseBody.record.actionLinks.delete.url, {
      headers: { Authtoken: authtoken },
    });
  },

  kthLocalGenericMarkup: async ({ request, authtoken }, use) => {
    const response = await request.post(
      `${CORA_API_URL}/record/diva-localGenericMarkup`,
      {
        data: createLocalGenericMarkup('kth'),
        headers: {
          Accept: 'application/vnd.cora.record+json',
          'Content-Type': 'application/vnd.cora.recordGroup+json',
          Authtoken: authtoken,
        },
      },
    );

    const responseBody = await response.json();

    await use(responseBody.record.data);

    await request.delete(responseBody.record.actionLinks.delete.url, {
      headers: { Authtoken: authtoken },
    });
  },
});
