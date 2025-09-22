import {
  APIRequestContext,
  test as base,
  Locator,
  type Page,
} from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { createDivaOutput } from '../testData/divaOutput';
import { createLocalGenericMarkup } from '../testData/localGenericMarkup';
import { addSubdomain } from './addSubdomain';
import type { DataGroup } from './coraTypes';
import { getFirstDataAtomicValueWithNameInData } from './coraUtils';

interface CoraData {
  name: string;
  value?: string;
  children?: CoraData[];
  attributes?: { [key: string]: string };
}

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
        getByDefinitionTerm: (dtText: string) =>
          page.locator(
            `xpath=//dt[.='${dtText}']/following-sibling::dd[preceding-sibling::dt[1][.='${dtText}']]`,
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
    // Set up
    const { id: publisherId, delete: deletePublisher } =
      await createRecordFromXML(
        request,
        '../testData/publisher.xml',
        'diva-publisher',
        authtoken,
      );

    const { id: subjectId, delete: deleteSubject } = await createRecordFromXML(
      request,
      '../testData/subject.xml',
      'diva-subject',
      authtoken,
    );

    const { id: courseId, delete: deleteCourse } = await createRecordFromXML(
      request,
      '../testData/course.xml',
      'diva-course',
      authtoken,
    );

    const { id: programmeId, delete: deleteProgramme } =
      await createRecordFromXML(
        request,
        '../testData/programme.xml',
        'diva-programme',
        authtoken,
      );

    const { id: localGenericMarkupId, delete: deleteLocalGenericMarkup } =
      await createRecordFromXML(
        request,
        '../testData/localGenericMarkup.xml',
        'diva-localGenericMarkup',
        authtoken,
      );

    const xml = fs.readFileSync(
      path.join(__dirname, '../testData/ultimateDivaOutput.xml'),
      'utf-8',
    );

    const updatedXML = xml
      .replace('{{LINKED_PUBLISHER_ID}}', publisherId)
      .replace('{{LINKED_SUBJECT_ID}}', subjectId)
      .replace('{{LINKED_COURSE_ID}}', courseId)
      .replace('{{LINKED_PROGRAMME_ID}}', programmeId)
      .replace('{{LINKED_LOCAL_GENERIC_MARKUP_ID}}', localGenericMarkupId);

    const response = await request.post(`${CORA_API_URL}/record/diva-output`, {
      data: updatedXML,
      headers: {
        Accept: 'application/vnd.cora.record+json',
        'Content-Type': 'application/vnd.cora.recordGroup+xml',
        Authtoken: authtoken,
      },
    });

    const responseBody = await response.json();

    // Run test
    await use(responseBody.record.data);

    // Clean up
    await request.delete(responseBody.record.actionLinks.delete.url, {
      headers: { Authtoken: authtoken },
    });
    await deletePublisher();
    await deleteSubject();
    await deleteCourse();
    await deleteProgramme();
    await deleteLocalGenericMarkup();
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

async function createRecordFromXML(
  request: APIRequestContext,
  xmlPath: string,
  recordType: string,
  authtoken: string,
) {
  const xml = fs.readFileSync(path.join(__dirname, xmlPath), 'utf-8');
  const response = await request.post(`${CORA_API_URL}/record/${recordType}`, {
    data: xml,
    headers: {
      Accept: 'application/vnd.cora.record+json',
      'Content-Type': 'application/vnd.cora.recordGroup+xml',
      Authtoken: authtoken,
    },
  });

  const responseBody = await response.json();

  const id = responseBody.record.data.children
    .find((c: CoraData) => c.name === 'recordInfo')
    ?.children.find((c: CoraData) => c.name === 'id')?.value;

  if (!response.ok()) {
    throw new Error(`Failed to create diva publisher`);
  }

  return {
    id,
    responseBody,
    delete: () =>
      request.delete(responseBody.record.actionLinks.delete.url, {
        headers: { Authtoken: authtoken },
      }),
  };
}
