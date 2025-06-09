import { test as base, type Page } from '@playwright/test';
import { createDivaOutput } from '../testData/divaOutput';
import { createLocalGenericMarkup } from '../testData/localGenericMarkup';
import type { DataGroup } from './coraTypes';
import { getFirstDataAtomicValueWithNameInData } from './coraUtils';
import { addSubdomain } from './addSubdomain';

const { CORA_API_URL, CORA_LOGIN_URL, TARGET_URL, CORA_USER, CORA_APPTOKEN } =
  process.env;

interface Fixtures {
  authtoken: string;
  kthPage: Page;
  divaOutput: DataGroup;
  kthDivaOutput: DataGroup;
  uuLocalGenericMarkup: DataGroup;
  kthLocalGenericMarkup: DataGroup;
}

export const test = base.extend<Fixtures>({
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
