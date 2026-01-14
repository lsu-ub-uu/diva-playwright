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

test.describe('Create person', () => {
  test('Create person', async ({ page, request, authtoken }) => {
    const mockFamilyName = faker.person.lastName();
    const mockGivenName = faker.person.firstName();

    // Go to start page
    await page.goto(createUrl('/diva-person'));

    // Log in
    await logIn(page);

    // Select validation type
    await page.getByRole('link', { name: 'divaClient_createText' }).click();

    await expect(page).toHaveTitle('divaClient_createRecordText');

    await page
      .getByRole('textbox', { name: 'namePartFamilyTextVarText', exact: true })
      .fill(mockFamilyName);

    await page
      .getByRole('textbox', { name: 'namePartGivenTextVarText', exact: true })
      .fill(mockGivenName);


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
