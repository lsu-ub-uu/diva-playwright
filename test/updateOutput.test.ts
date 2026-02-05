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
import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createUrl } from './util/createUrl';
import { logIn } from './util/logIn';
import {
  getFirstDataAtomicValueWithNameInData,
  getFirstDataGroupWithNameInData,
} from './util/coraUtils';
import path from 'node:path';

test.describe('Update output', () => {
  test('updates an existing report', async ({ page, divaOutput }) => {
    const recordId = getFirstDataAtomicValueWithNameInData(
      getFirstDataGroupWithNameInData(divaOutput, 'recordInfo'),
      'id',
    );
    const recordTitle = getFirstDataAtomicValueWithNameInData(
      getFirstDataGroupWithNameInData(divaOutput, 'titleInfo'),
      'title',
    );

    await page.goto(createUrl(`/diva-output/${recordId}/update`));

    // Log in
    await logIn(page);

    const mainForm = page.getByRole('main');
    //Assert update page info
    await expect(
      mainForm.getByRole('heading', {
        level: 1,
        name: 'reportUpdateGroupText',
      }),
    ).toBeVisible();

    await mainForm
      .getByRole('button', { name: 'titleInfoLangGroupText' })
      .click();
    const titleGroup = mainForm.getByRole('region', {
      name: 'titleInfoLangGroupText',
    });
    await expect(
      titleGroup.getByLabel('titleTextVarText', { exact: true }),
    ).toHaveValue(recordTitle);

    // Update year
    await mainForm.getByRole('button', { name: 'originInfoGroupText' }).click();
    await mainForm
      .getByRole('region', { name: 'dateIssuedGroupText' })
      .getByRole('textbox', { name: 'yearTextVarText' })
      .fill(faker.date.recent().getFullYear().toString());

    await mainForm
      .getByRole('button', { name: 'divaClient_SubmitButtonText' })
      .click();

    await expect(
      page.getByText('divaClient_recordSuccessfullyUpdatedText'),
    ).toBeVisible();
  });

  let downloadLink: string | null = null;

  test.skip('updates an existing report with a binary', async ({
    page,
    divaOutput,
  }) => {
    const recordId = getFirstDataAtomicValueWithNameInData(
      getFirstDataGroupWithNameInData(divaOutput, 'recordInfo'),
      'id',
    );
    await page.goto(createUrl(`/diva-output/${recordId}/update`));

    // Log in
    await logIn(page);

    const mainForm = page.getByRole('main');
    await expect(mainForm.getByRole('heading', { level: 1 })).toHaveText(
      'reportUpdateGroupText',
    );
    // Upload file
    await mainForm
      .getByRole('button', { name: 'attachmentHeadlineText' })
      .click();
    await mainForm
      .getByLabel('attachmentFileLinkText')
      .setInputFiles(path.join(__dirname, 'assets/dog.jpg'));

    await expect(
      mainForm
        .getByRole('region', { name: 'masterGroupText' })
        .getByLabel('originalFileNameTextVarText'),
    ).toHaveText('dog.jpg');

    await mainForm
      .getByRole('combobox', { name: 'attachmentTypeCollectionVarText' })
      .selectOption({ label: 'fullTextItemText' });

    // Select binary visibility
    await mainForm
      .getByRole('combobox', {
        name: 'attachmentAvailabilityCollectionVarText',
      })
      .selectOption({ label: 'availableNowItemText' });

    // Submit form
    await mainForm
      .getByRole('button', { name: 'divaClient_SubmitButtonText' })
      .click();

    // Assert update snackbar
    await expect(
      page.getByText('divaClient_recordSuccessfullyUpdatedText'),
    ).toBeVisible();

    // Store binary record URL to use in cleanup step.
    await mainForm
      .getByRole('button', { name: 'attachmentHeadlineText' })
      .click();
    downloadLink = await mainForm
      .getByRole('link', { name: 'resourceLinkDownloadText' })
      .getAttribute('href');
  });

  test.afterAll(async ({ authtoken, request }) => {
    /* Delete binary record */
    const recordUrl = downloadLink?.replace(/\/master.*/, '');

    if (recordUrl) {
      await request.delete(recordUrl, {
        headers: { authToken: authtoken },
      });
    }
  });
});
