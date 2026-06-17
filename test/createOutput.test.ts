/*
 * Copyright 2025 Uppsala University Library
 *
 * This file is part of DiVA Client.
 *
 *     DiVA Client is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     DiVA Client is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 */

import { test } from './util/fixtures';
import { APIRequestContext, expect, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createUrl } from './util/createUrl';
import { logIn } from './util/logIn';

const VALIDATION_TYPES_WITH_POPULAR_GENRE_CONTENT_TYPE = [
  'publication_newspaper-article',
  'publication_magazine-article',
  'publication_preprint',
  'diva_manuscript',
];

test.describe('Create output', () => {
  test('Create Patent', async ({ page, request, authtoken }) => {
    await createOutputOfType(
      'intellectual-property_patent',
      page,
      request,
      authtoken,
    );
  });

  test('Create Editorial proceeding', async ({ page, request, authtoken }) => {
    await createOutputOfType(
      'conference_proceeding',
      page,
      request,
      authtoken,
      ['genreContentType'],
    );
  });

  test('Create Licentiate thesis (compilation)', async ({
    page,
    request,
    authtoken,
  }) => {
    await createOutputOfType(
      'publication_licentiate-thesis-compilation',
      page,
      request,
      authtoken,
    );
  });

  test('Create Article in daily/newspaper', async ({
    page,
    request,
    authtoken,
  }) => {
    await createOutputOfType(
      'publication_newspaper-article',
      page,
      request,
      authtoken,
      ['genreContentType'],
    );
  });

  test('Create Paper in proceeding Scholarly or annotated edition', async ({
    page,
    request,
    authtoken,
  }) => {
    await createOutputOfType('conference_paper', page, request, authtoken, [
      'genreContentType',
    ]);
  });

  test('Create Scholarly or annotated edition', async ({
    page,
    request,
    authtoken,
  }) => {
    //
    await createOutputOfType(
      'publication_critical-edition',
      page,
      request,
      authtoken,
      ['genreContentType'],
    );
  });

  test('Create Report', async ({ page, request, authtoken }) => {
    await createOutputOfType('publication_report', page, request, authtoken, [
      'genreContentType',
    ]);
  });

  test('Create Chapter in collected works', async ({
    page,
    request,
    authtoken,
  }) => {
    await createOutputOfType(
      'publication_book-chapter',
      page,
      request,
      authtoken,
      ['genreContentType'],
    );
  });

  test('Create Article in scientific journal', async ({
    page,
    request,
    authtoken,
  }) => {
    await createOutputOfType(
      'publication_journal-article',
      page,
      request,
      authtoken,
      ['publicationStatus', 'genreContentType'],
    );
  });

  test('Create Dissertation (older thesis)', async ({
    page,
    request,
    authtoken,
  }) => {
    //diva_dissertation
    await createOutputOfType('diva_dissertation', page, request, authtoken);
  });

  test('Create Licentiate thesis (monograph)', async ({
    page,
    request,
    authtoken,
  }) => {
    //publication_licentiate-thesis-monograph
    await createOutputOfType(
      'publication_licentiate-thesis-monograph',
      page,
      request,
      authtoken,
    );
  });

  test('Create Artistic work', async ({ page, request, authtoken }) => {
    //artistic-work_original-creative-work
    await createOutputOfType(
      'artistic-work_original-creative-work',
      page,
      request,
      authtoken,
      ['genreContentType'],
    );
  });

  test('Create Review article', async ({ page, request, authtoken }) => {
    //publication_review-article
    await createOutputOfType(
      'publication_review-article',
      page,
      request,
      authtoken,
      ['publicationStatus', 'genreContentType'],
    );
  });

  test('Create Chapter in report', async ({ page, request, authtoken }) => {
    //publication_report-chapter
    await createOutputOfType(
      'publication_report-chapter',
      page,
      request,
      authtoken,
      ['genreContentType'],
    );
  });

  test('Create Degree project (independent project)', async ({
    page,
    request,
    authtoken,
  }) => {
    //diva_degree-project
    await createOutputOfType('diva_degree-project', page, request, authtoken, [
      'studentDegree',
    ]);
  });

  test('Create Introductory text in journal / proceeding (letters, editorials, comments, notes)', async ({
    page,
    request,
    authtoken,
  }) => {
    //publication_editorial-letter
    await createOutputOfType(
      'publication_editorial-letter',
      page,
      request,
      authtoken,
      ['publicationStatus', 'genreContentType'],
    );
  });

  test('Create Contribution to an encyclopedia', async ({
    page,
    request,
    authtoken,
  }) => {
    //publication_encyclopedia-entry
    await createOutputOfType(
      'publication_encyclopedia-entry',
      page,
      request,
      authtoken,
      ['genreContentType'],
    );
  });

  test('Create Poster', async ({ page, request, authtoken }) => {
    //conference_poster
    await createOutputOfType('conference_poster', page, request, authtoken, [
      'genreContentType',
    ]);
  });

  test('Create Editorial collection', async ({ page, request, authtoken }) => {
    //publication_edited-book
    await createOutputOfType(
      'publication_edited-book',
      page,
      request,
      authtoken,
      ['genreContentType'],
    );
  });

  test('Create Documented artistic research project (doctoral thesis)', async ({
    page,
    request,
    authtoken,
  }) => {
    //artistic-work_artistic-thesis
    await createOutputOfType(
      'artistic-work_artistic-thesis',
      page,
      request,
      authtoken,
    );
  });

  test('Create Review', async ({ page, request, authtoken }) => {
    //publication_book-review
    await createOutputOfType(
      'publication_book-review',
      page,
      request,
      authtoken,
      ['publicationStatus', 'genreContentType'],
    );
  });

  test('Create Other conference contributions', async ({
    page,
    request,
    authtoken,
  }) => {
    //conference_other
    await createOutputOfType('conference_other', page, request, authtoken, [
      'genreContentType',
    ]);
  });

  test('Create Article in other journals', async ({
    page,
    request,
    authtoken,
  }) => {
    //publication_magazine-article
    await createOutputOfType(
      'publication_magazine-article',
      page,
      request,
      authtoken,
      ['genreContentType'],
    );
  });

  test('Create Preprint', async ({ page, request, authtoken }) => {
    //publication_preprint
    await createOutputOfType('publication_preprint', page, request, authtoken, [
      'genreContentType',
    ]);
  });

  test('Create Book', async ({ page, request, authtoken }) => {
    //publication_book
    await createOutputOfType('publication_book', page, request, authtoken, [
      'genreContentType',
    ]);
  });

  test('Create Manuscript', async ({ page, request, authtoken }) => {
    //diva_manuscript
    await createOutputOfType('diva_manuscript', page, request, authtoken, [
      'genreContentType',
    ]);
  });

  test('Create Other publication', async ({ page, request, authtoken }) => {
    //publication_other
    await createOutputOfType('publication_other', page, request, authtoken, [
      'genreContentType',
    ]);
  });

  test('Create Working paper', async ({ page, request, authtoken }) => {
    //publication_working-paper
    await createOutputOfType(
      'publication_working-paper',
      page,
      request,
      authtoken,
      ['genreContentType'],
    );
  });

  test('Create Foreword/Afterword', async ({ page, request, authtoken }) => {
    //publication_foreword-afterword
    await createOutputOfType(
      'publication_foreword-afterword',
      page,
      request,
      authtoken,
      ['genreContentType'],
    );
  });

  test('Create Doctoral thesis (monograph)', async ({
    page,
    request,
    authtoken,
  }) => {
    //publication_doctoral-thesis-monograph
    await createOutputOfType(
      'publication_doctoral-thesis-monograph',
      page,
      request,
      authtoken,
    );
  });

  test('Create Doctoral thesis (compilation)', async ({
    page,
    request,
    authtoken,
  }) => {
    //publication_doctoral-thesis-compilation
    await createOutputOfType(
      'publication_doctoral-thesis-compilation',
      page,
      request,
      authtoken,
    );
  });
});

const getRecordIdFromUpdatePageUrl = (page: Page) => {
  const url = page.url(); // /diva-output/:id/update
  const segments = url.split('/');
  return segments[segments.length - 2];
};

const createOutputOfType = async (
  validationType: string,
  page: Page,
  request: APIRequestContext,
  authtoken: string,
  additionalFields?: string[],
) => {
  const mockTitle = faker.book.title();

  // Go to start page
  await page.goto(createUrl('/'));

  // Log in
  await logIn(page);

  // Select validation type
  await page.getByRole('button', { name: 'divaClient_createText' }).click();
  await page
    .getByRole('menuitem', {
      name: `${validationType}Text`,
      exact: true,
    })
    .click();

  await expect(page).toHaveTitle('divaClient_createRecordText | DiVA');

  const form = page.getByRole('main');

  // Language
  await form
    .getByRole('button', { name: 'languageGroupText', exact: true })
    .click();
  await form
    .getByRole('region', {
      name: 'languageGroupText',
    })
    .getByRole('combobox', { name: 'languageTermCollectionVarText' })
    .fill('gerLangItemText');
  await page
    .getByRole('option', { name: 'gerLangItemText', exact: true })
    .click();

  // Publication Status
  if (additionalFields?.includes('publicationStatus')) {
    await form
      .getByRole('button', { name: 'genreContentTypeCollectionText' })
      .click();
    await form
      .getByRole('combobox', { name: 'publicationStatusCollectionVarText' })
      .selectOption({ label: 'publishedItemText' });
    await form
      .getByRole('button', { name: 'genreContentTypeCollectionText' })
      .click();
  }

  const hasGenreContentType =
    !VALIDATION_TYPES_WITH_POPULAR_GENRE_CONTENT_TYPE.includes(validationType);

  const hasPopularGenreContentType =
    VALIDATION_TYPES_WITH_POPULAR_GENRE_CONTENT_TYPE.includes(validationType);
  // Content type
  if (additionalFields?.includes('genreContentType') && hasGenreContentType) {
    await form
      .getByRole('button', { name: 'genreContentTypeCollectionText' })
      .click();
    await form
      .getByRole('combobox', { name: 'genreContentTypeCollectionText' })
      .selectOption({ label: 'peerReviewedItemText' });
    await form
      .getByRole('button', { name: 'genreContentTypeCollectionText' })
      .click();
  }

  if (
    additionalFields?.includes('genreContentType') &&
    hasPopularGenreContentType
  ) {
    await form
      .getByRole('button', { name: 'genreContentTypeCollectionText' })
      .click();
    await form
      .getByRole('combobox', {
        name: 'genreContentTypeOtherPopularCollectionVarText',
      })
      .selectOption({ label: 'popularScientificItemText' });
  }

  // Title info
  await form.getByRole('button', { name: 'titleInfoLangGroupText' }).click();
  const titleGroup = form.getByRole('region', {
    name: 'titleInfoLangGroupText',
  });
  await titleGroup
    .getByRole('combobox', { name: 'languageCollectionVarText' })
    .fill('gerLangItemText');
  await page
    .getByRole('option', { name: 'gerLangItemText', exact: true })
    .click();
  await titleGroup
    .getByRole('textbox', { name: 'titleTextVarText', exact: true })
    .fill(mockTitle);

  // Origin info
  if (validationType !== 'diva_manuscript') {
    await form.getByRole('button', { name: 'originInfoGroupText' }).click();

    if (validationType !== 'publication_newspaper-article') {
      await form
        .getByRole('region', { name: 'dateIssuedGroupText' })
        .getByRole('textbox', { name: 'yearTextVarText' })
        .fill(faker.date.recent().getFullYear().toString());
    }
    if (validationType === 'publication_newspaper-article') {
      await form
        .getByRole('region', { name: 'dateIssuedRequiredGroupText' })
        .getByRole('textbox', { name: 'yearTextVarText' })
        .fill('2020');
      await form
        .getByRole('region', { name: 'dateIssuedRequiredGroupText' })
        .getByRole('textbox', { name: 'monthTextVarText' })
        .fill('01');

      await form
        .getByRole('region', { name: 'dateIssuedRequiredGroupText' })
        .getByRole('textbox', { name: 'dayTextVarText' })
        .fill('01');
    }
  }
  // SSIF
  await form.getByRole('button', { name: 'ssifCollectionVarText' }).click();
  await form
    .getByRole('region', { name: 'ssifCollectionVarText' })
    .getByRole('combobox', {
      name: 'ssifCollectionVarText',
    })
    .fill('1ItemText');
  await page
    .getByRole('option', {
      name: '1ItemText',
      exact: true,
    })
    .click();
  if (additionalFields?.includes('studentDegree')) {
    await form
      .getByRole('button', { name: 'studentDegreeHeadlineText' })
      .click();

    await form
      .getByRole('combobox', { name: 'degreeLevelCollectionVarText' })
      .selectOption({ label: 'H2ItemText' });

    await form
      .getByRole('combobox', {
        name: 'creditsCollectionVarText',
      })
      .fill('15hpItemText');
    await page
      .getByRole('option', {
        name: '15hpItemText',
        exact: true,
      })
      .click();
  }

  //Admin info
  await form
    .getByRole('button', { name: 'adminInfoDivaGroupText', exact: true })
    .click();
  await form
    .getByRole('combobox', { name: 'reviewedCollectionVarText' })
    .selectOption({ label: 'trueDivaItemText' });

  // Record info
  await form
    .getByRole('button', { name: 'recordInfoOutputUpdateGroupText' })
    .click();

  await form
    .getByRole('combobox', { name: 'visibilityCollectionVarText' })
    .selectOption({ label: 'publishedItemText' });
  await form
    .getByRole('combobox', { name: 'permissionUnitLinkText' })
    .fill('uu');
  await page.getByRole('option', { name: 'uuPermissionUnitText' }).click();

  // Submit
  await form
    .getByRole('button', { name: 'divaClient_SubmitButtonText' })
    .click();

  // Assert redirected to update form
  await expect(
    page.getByText('divaClient_recordSuccessfullyCreatedText'),
  ).toBeVisible();

  // Clean up created record
  const id = getRecordIdFromUpdatePageUrl(page);
  await request.delete(`${process.env.CORA_API_URL}/record/diva-output/${id}`, {
    headers: { Authtoken: authtoken },
  });
};
