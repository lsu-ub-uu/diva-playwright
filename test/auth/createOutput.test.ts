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

import { test } from '../util/fixtures';
import {
  APIRequestContext,
  expect,
  type Locator,
  type Page,
} from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createUrl } from '../util/createUrl';
import { validationTypes } from '../testData/validationTypes/validationTypes';

const VALIDATION_TYPES_WITH_POPULAR_GENRE_CONTENT_TYPE = [
  'publication_newspaper-article',
  'publication_magazine-article',
  'publication_preprint',
  'diva_manuscript',
];

test.describe('Output', () => {
  validationTypes.forEach(({ name, validationType, additionalFields }) => {
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

const selectComboboxOption = async (
  scope: Locator,
  comboboxName: string,
  optionName: string,
  filterText = optionName,
) => {
  const combobox = scope.getByRole('combobox', {
    name: comboboxName,
    exact: true,
  });

  await combobox.click();
  const filter = scope.getByRole('textbox', { name: /Filtrera alternativ/i });
  await filter.fill(filterText);
  await filter.press('Enter');
  await expect(combobox).toContainText(optionName);
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

  // Select validation type
  await page.getByRole('button', { name: 'divaClient_createText' }).click();
  await page
    .getByRole('textbox', { name: 'divaClient_filteringText' })
    .fill(validationType);
  await page
    .getByRole('menuitem', { name: `${validationType}Text`, exact: true })
    .click();

  await expect(page).toHaveTitle('divaClient_createRecordText | DiVA');

  const form = page.getByRole('main');

  // Language
  await form
    .getByRole('button', { name: 'languageGroupText', exact: true })
    .click();
  await selectComboboxOption(
    form,
    'languageTermCollectionVarText',
    'gerLangItemText',
    'ger',
  );

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
  await selectComboboxOption(
    titleGroup,
    'languageCollectionVarText',
    'gerLangItemText',
    'ger',
  );
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
  const ssif = form.getByRole('region', { name: 'ssifCollectionVarText' });
  await selectComboboxOption(ssif, 'ssifCollectionVarText', '1ItemText', '1');

  if (additionalFields?.includes('studentDegree')) {
    await form
      .getByRole('button', { name: 'studentDegreeHeadlineText' })
      .click();

    await form
      .getByRole('combobox', { name: 'degreeLevelCollectionVarText' })
      .selectOption({ label: 'H2ItemText' });

    await selectComboboxOption(
      form,
      'creditsCollectionVarText',
      '15hpItemText',
      '15',
    );
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
