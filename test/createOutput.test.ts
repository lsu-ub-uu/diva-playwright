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
    await page.getByRole('button', { name: 'Skapa output' }).click();
    await page.getByRole('menuitem', { name: 'Rapport' }).click();

    await expect(page).toHaveTitle(/^Skapa rapport/);

    // Fill create form
    await page
      .getByRole('region', {
        name: 'Verkets språk',
      })
      .getByRole('combobox', { name: 'Språk' })
      .fill('Tyska');
    await page.getByRole('option', { name: 'Tyska', exact: true }).click();

    const titleGroup = page.getByRole('region', {
      name: 'Titel',
    });
    await titleGroup.getByRole('combobox', { name: 'Språk' }).fill('Tyska');
    await page.getByRole('option', { name: 'Tyska', exact: true }).click();
    await titleGroup
      .getByRole('textbox', { name: 'Huvudtitel' })
      .fill(mockTitle);

    await page
      .getByRole('combobox', { name: 'Typ av innehåll' })
      .selectOption({ label: 'Sakkunniggranskat' });

    /*     await page
      .getByRole('combobox', { name: 'Verk baserat på konstnärlig grund' })
      .selectOption({ label: 'Falskt' }); */

    await page
      .getByRole('region', { name: 'Utgivningsdatum' })
      .getByRole('textbox', { name: 'År' })
      .fill(faker.date.recent().getFullYear().toString());

    await page
      .getByRole('combobox', { name: /^Postens synlighet/ })
      .selectOption({ label: 'Publicerad' });

    await page.getByRole('combobox', { name: 'Rättighetsenhet' }).fill('uu');
    await page.getByRole('option', { name: 'Rättighetsenhet' }).click();

    await page
      .getByRole('combobox', { name: /^Bibliografiskt granskad/ })
      .selectOption({ label: 'Sant' });

    // Nationell ämneskategori (SSIF)
    await page.getByRole('button', { name: 'Ämnesord/klassifikation' }).click();
    await page
      .getByRole('combobox', {
        name: 'Nationell ämneskategori (SSIF)',
      })
      .fill('Atom- och molekylfysik och optik');
    await page
      .getByRole('option', {
        name: '(10302) Atom- och molekylfysik och optik',
        exact: true,
      })
      .click();

    // Submit
    await page.getByRole('button', { name: 'Skicka in' }).click();

    // Assert redirected to update page
    await expect(
      page.getByText(/^Record was successfully created/),
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

  test('Create report', async ({ page, request, authtoken }) => {
    const mockTitle = faker.book.title();
    const mockSubtitle = faker.book.title();
    const mockAltTitle = faker.book.title();
    const mockAltSubtitle = faker.book.title();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const keywords = faker.lorem.words(10);
    const abstract = faker.lorem.paragraphs(1);

    // Go to start page
    await page.goto(createUrl('/'));

    // Log in
    await logIn(page);

    // Select validation type
    await page.getByRole('button', { name: 'Skapa output' }).click();
    await page.getByRole('menuitem', { name: 'Rapport' }).click();

    await expect(page).toHaveTitle(/^Skapa rapport/);

    // Verket språk
    await page
      .getByRole('region', {
        name: 'Verkets språk',
      })
      .getByRole('combobox', { name: 'Språk' })
      .fill('Tyska');
    await page.getByRole('option', { name: 'Tyska', exact: true }).click();

    // Title
    const titleGroup = page.getByRole('region', {
      name: 'Titel',
    });
    await titleGroup.getByRole('combobox', { name: 'Språk' }).fill('Tyska');
    await page.getByRole('option', { name: 'Tyska', exact: true }).click();
    await titleGroup
      .getByRole('textbox', { name: 'Huvudtitel' })
      .fill(mockTitle);
    await titleGroup
      .getByRole('textbox', { name: 'Undertitel' })
      .fill(mockSubtitle);

    // Alternativ titel
    await page
      .getByRole('button', { name: 'Lägg till Alternativ titel' })
      .click();

    const alternativeTitleGroup = page.getByRole('region', {
      name: 'Alternativ Titel',
    });
    await alternativeTitleGroup
      .getByRole('combobox', { name: 'Språk' })
      .fill('Tyska');
    await page.getByRole('option', { name: 'Tyska', exact: true }).click();

    await alternativeTitleGroup
      .getByRole('textbox', { name: 'Huvudtitel' })
      .fill(mockAltTitle);

    await alternativeTitleGroup
      .getByRole('textbox', { name: 'Undertitel' })
      .fill(mockAltSubtitle);

    // Typ av innehåll
    await page
      .getByRole('combobox', { name: 'Typ av innehåll' })
      .selectOption({ label: 'Sakkunniggranskat' });

    //Verk baserat på konstnärlig grund
    await page
      .getByRole('button', {
        name: 'Lägg till Verk baserat på konstnärlig grund',
      })
      .click();
    await page
      .getByRole('combobox', { name: 'Verk baserat på konstnärlig grund' })
      .selectOption({ label: 'Falskt' });

    // Utgivningsdatum
    await page
      .getByRole('region', { name: 'Utgivningsdatum' })
      .getByRole('group', { name: 'År' })
      .getByLabel('År')
      .fill(faker.date.recent().getFullYear().toString());

    // Författare, redaktör eller annan roll
    await page
      .getByRole('button', {
        name: 'Lägg till författare, redaktör eller annan roll',
      })
      .click();
    const authorGroup = page.getByRole('region', {
      name: 'Författare, redaktör eller annan roll',
    });
    await authorGroup
      .getByRole('textbox', { name: 'Efternamn' })
      .fill(lastName);
    await authorGroup.getByRole('textbox', { name: 'Förnamn' }).fill(firstName);

    // Antal upphovspersoner
    await page
      .getByRole('button', { name: 'Lägg till antal upphovspersoner' })
      .click();
    await page
      .getByRole('textbox', { name: 'Antal upphovspersoner' })
      .fill('2');

    // Abstract
    await page.getByRole('button', { name: 'Ämnesord/klassifikation' }).click();
    await page.getByRole('button', { name: 'Lägg till abstract' }).click();
    const abstractGroup = page.getByRole('group', { name: 'Abstract' });
    await abstractGroup.getByRole('combobox', { name: 'Språk' }).fill('Tyska');
    await page.getByRole('option', { name: 'Tyska', exact: true }).click();
    await abstractGroup
      .getByRole('textbox', { name: 'Abstract' })
      .fill(abstract);

    // Nyckelord
    await page.getByRole('button', { name: 'Lägg till nyckelord' }).click();
    const keywordsGroup = page.getByRole('region', {
      name: 'Nyckelord',
    });
    await keywordsGroup.getByRole('combobox', { name: 'Språk' }).fill('Tyska');
    await page.getByRole('option', { name: 'Tyska', exact: true }).click();
    await keywordsGroup
      .getByRole('textbox', { name: 'Nyckelord' })
      .fill(keywords);

    // Nationell ämneskategori (SSIF)
    await page
      .getByRole('combobox', {
        name: 'Nationell ämneskategori (SSIF)',
      })
      .fill('Atom- och molekylfysik och optik');
    await page
      .getByRole('option', {
        name: '(10302) Atom- och molekylfysik och optik',
        exact: true,
      })
      .click();

    // Globalt mål för hållbar utveckling
    await page
      .getByRole('button', {
        name: 'Lägg till Hållbar utveckling',
      })
      .click();
    await page
      .getByRole('combobox', { name: 'Globalt mål för hållbar utveckling' })
      .selectOption({
        label: '8. Anständiga arbetsvillkor och ekonomisk tillväxt',
      });

    // Postens synlighet
    await page
      .getByRole('combobox', { name: 'Postens synlighet' })
      .selectOption({ label: 'Publicerad' });

    // Rättighetsenhet
    await page.getByRole('combobox', { name: 'Rättighetsenhet' }).fill('uu');
    await page.getByRole('option', { name: 'Rättighetsenhet' }).click();

    // Bibliografiskt granskad
    await page
      .getByRole('combobox', { name: 'Bibliografiskt granskad' })
      .selectOption({ label: 'Sant' });

    // Submit
    await page.getByRole('button', { name: 'Skicka in' }).click();

    // Assert redirected to update page
    await expect(
      page.getByText(/^Record was successfully created/),
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
