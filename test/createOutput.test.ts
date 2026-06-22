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

const testCases = [
  {
    name: 'Patent',
    validationType: 'intellectual-property_patent',
    additionalFields: undefined,
  },
  {
    name: 'Editorial proceeding',
    validationType: 'conference_proceeding',
    additionalFields: ['genreContentType'],
  },
  {
    name: 'Licentiate thesis (compilation)',
    validationType: 'publication_licentiate-thesis-compilation',
    additionalFields: undefined,
  },
  {
    name: 'Article in daily/newspaper',
    validationType: 'publication_newspaper-article',
    additionalFields: ['genreContentType'],
  },
  {
    name: 'Paper in proceeding Scholarly or annotated edition',
    validationType: 'conference_paper',
    additionalFields: ['genreContentType'],
  },
  {
    name: 'Scholarly or annotated edition',
    validationType: 'publication_critical-edition',
    additionalFields: ['genreContentType'],
  },
  {
    name: 'Report',
    validationType: 'publication_report',
    additionalFields: ['genreContentType'],
  },
  {
    name: 'Chapter in collected works',
    validationType: 'publication_book-chapter',
    additionalFields: ['genreContentType'],
  },
  {
    name: 'Article in scientific journal',
    validationType: 'publication_journal-article',
    additionalFields: ['publicationStatus', 'genreContentType'],
  },
  {
    name: 'Dissertation (older thesis)',
    validationType: 'diva_dissertation',
    additionalFields: undefined,
  },
  {
    name: 'Licentiate thesis (monograph)',
    validationType: 'publication_licentiate-thesis-monograph',
    additionalFields: undefined,
  },
  {
    name: 'Artistic work',
    validationType: 'artistic-work_original-creative-work',
    additionalFields: ['genreContentType'],
  },
  {
    name: 'Review article',
    validationType: 'publication_review-article',
    additionalFields: ['publicationStatus', 'genreContentType'],
  },
  {
    name: 'Chapter in report',
    validationType: 'publication_report-chapter',
    additionalFields: ['genreContentType'],
  },
  {
    name: 'Degree project (independent project)',
    validationType: 'diva_degree-project',
    additionalFields: ['studentDegree'],
  },
  {
    name: 'Introductory text in journal / proceeding (letters, editorials, comments, notes)',
    validationType: 'publication_editorial-letter',
    additionalFields: ['publicationStatus', 'genreContentType'],
  },
  {
    name: 'Contribution to an encyclopedia',
    validationType: 'publication_encyclopedia-entry',
    additionalFields: ['genreContentType'],
  },
  {
    name: 'Poster',
    validationType: 'conference_poster',
    additionalFields: ['genreContentType'],
  },
  {
    name: 'Editorial collection',
    validationType: 'publication_edited-book',
    additionalFields: ['genreContentType'],
  },
  {
    name: 'Documented artistic research project (doctoral thesis)',
    validationType: 'artistic-work_artistic-thesis',
    additionalFields: undefined,
  },
  {
    name: 'Review',
    validationType: 'publication_book-review',
    additionalFields: ['publicationStatus', 'genreContentType'],
  },
  {
    name: 'Other conference contributions',
    validationType: 'conference_other',
    additionalFields: ['genreContentType'],
  },
  {
    name: 'Article in other journals',
    validationType: 'publication_magazine-article',
    additionalFields: ['genreContentType'],
  },
  {
    name: 'Preprint',
    validationType: 'publication_preprint',
    additionalFields: ['genreContentType'],
  },
  {
    name: 'Book',
    validationType: 'publication_book',
    additionalFields: ['genreContentType'],
  },
  {
    name: 'Manuscript',
    validationType: 'diva_manuscript',
    additionalFields: ['genreContentType'],
  },
  {
    name: 'Other publication',
    validationType: 'publication_other',
    additionalFields: ['genreContentType'],
  },
  {
    name: 'Working paper',
    validationType: 'publication_working-paper',
    additionalFields: ['genreContentType'],
  },
  {
    name: 'Foreword/Afterword',
    validationType: 'publication_foreword-afterword',
    additionalFields: ['genreContentType'],
  },
  {
    name: 'Doctoral thesis (monograph)',
    validationType: 'publication_doctoral-thesis-monograph',
    additionalFields: undefined,
  },
  {
    name: 'Doctoral thesis (compilation)',
    validationType: 'publication_doctoral-thesis-compilation',
    additionalFields: undefined,
  },
];

test.describe('Output', () => {
  testCases.forEach(({ name, validationType, additionalFields }) => {
    test(`Create ${name}`, async ({ page, request, authtoken }) => {
      await createOutputOfType(
        validationType,
        page,
        request,
        authtoken,
        additionalFields,
      );
    });
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
