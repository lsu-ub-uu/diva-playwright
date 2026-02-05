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
import { expect, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createUrl } from './util/createUrl';
import { logIn } from './util/logIn';

test.describe('Create output', () => {
  test('Create report mini', async ({ page, request, authtoken }) => {
    const mockTitle = faker.book.title();

    // Go to start page
    await page.goto(createUrl('/'));

    // Log in
    await logIn(page);

    // Select validation type
    await page.getByRole('button', { name: 'divaClient_createText' }).click();
    await page
      .getByRole('menuitem', { name: 'publication_reportText', exact: true })
      .click();

    await expect(page).toHaveTitle('divaClient_createRecordText | DiVA');

    // Language
    await page
      .getByRole('button', { name: 'languageGroupText', exact: true })
      .click();
    await page
      .getByRole('region', {
        name: 'languageGroupText',
      })
      .getByRole('combobox', { name: 'languageTermCollectionVarText' })
      .fill('gerLangItemText');
    await page
      .getByRole('option', { name: 'gerLangItemText', exact: true })
      .click();

    // Content type
    await page
      .getByRole('button', { name: 'genreContentTypeCollectionText' })
      .click();
    await page
      .getByRole('combobox', { name: 'genreContentTypeCollectionText' })
      .selectOption({ label: 'peerReviewedItemText' });

    // Title info
    await page.getByRole('button', { name: 'titleInfoLangGroupText' }).click();
    const titleGroup = page.getByRole('region', {
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
    await page.getByRole('button', { name: 'originInfoGroupText' }).click();
    await page
      .getByRole('region', { name: 'dateIssuedGroupText' })
      .getByRole('textbox', { name: 'yearTextVarText' })
      .fill(faker.date.recent().getFullYear().toString());

    // SSIF
    await page.getByRole('button', { name: 'ssifCollectionVarText' }).click();
    await page
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

    //Admin info
    await page
      .getByRole('button', { name: 'adminInfoDivaGroupText', exact: true })
      .click();
    await page
      .getByRole('combobox', { name: 'reviewedCollectionVarText' })
      .selectOption({ label: 'trueDivaItemText' });

    // Record info
    await page
      .getByRole('button', { name: 'recordInfoOutputUpdateGroupText' })
      .click();

    await page
      .getByRole('combobox', { name: 'visibilityCollectionVarText' })
      .selectOption({ label: 'publishedItemText' });
    await page
      .getByRole('combobox', { name: 'permissionUnitLinkText' })
      .fill('uu');
    await page.getByRole('option', { name: 'permissionUnitGroupText' }).click();

    // Submit
    await page
      .getByRole('button', { name: 'divaClient_SubmitButtonText' })
      .click();

    // Assert redirected to update page
    await expect(
      page.getByText('divaClient_recordSuccessfullyCreatedText'),
    ).toBeVisible();

    // Clean up created record
    const id = getRecordIdFromUpdatePageUrl(page);
    await request.delete(
      `${process.env.CORA_API_URL}/record/diva-output/${id}`,
      {
        headers: { Authtoken: authtoken },
      },
    );
  });
});

const getRecordIdFromUpdatePageUrl = (page: Page) => {
  const url = page.url(); // /diva-output/:id/update
  const segments = url.split('/');
  return segments[segments.length - 2];
};
