import { test } from './util/fixtures';
import { expect } from '@playwright/test';
import { createUrl } from './util/createUrl';
import {
  getFirstDataAtomicValueWithNameInData,
  getFirstDataGroupWithNameInData,
} from './util/coraUtils';

test.describe('View output', () => {
  test('View report', async ({ page, ultimateDivaOutput }) => {
    const recordId = getFirstDataAtomicValueWithNameInData(
      getFirstDataGroupWithNameInData(ultimateDivaOutput, 'recordInfo'),
      'id',
    );

    await page.goto(createUrl(`/diva-output/${recordId}`));

    // Title
    await expect(page.getByRole('heading', { level: 1 }), {
      message: 'Title',
    }).toHaveText(
      'Future fisheries: Status, trends and future perspectives concerning the energy transition of fisheries with focus on Nordic countries',
    );

    // Authors
    const authors = page.getByDefinitionTerm(
      'Författare, redaktör eller annan roll',
    );

    await expect(authors.getByText('Sara Hornborg'), {
      message: 'Author name',
    }).toBeVisible();
    await expect(authors.getByText('Karl Gunnar Aarsæther'), {
      message: 'Author name',
    }).toBeVisible();
    await expect(authors.getByText('François Bastardie'), {
      message: 'Author name',
    }).toBeVisible();
    await expect(authors.getByText('Sepideh Jafarzadeh'), {
      message: 'Author name',
    }).not.toBeVisible();

    await authors.getByRole('button', { name: 'Visa mer' }).click();
    await expect(authors.getByText('Sepideh Jafarzadeh'), {
      message: 'Author name',
    }).toBeVisible();

    await expect(page.getByDefinitionTerm('Antal upphovspersoner'), {
      message: 'Number of authors',
    }).toHaveText('12');

    await expect(
      page.getByDefinitionTerm(
        'Organisation som författare, redaktör eller annan roll',
      ),
      { message: 'Author organization' },
    ).toHaveText('Nordic Council of Ministers (Författare)');

    await expect(page.getByDefinitionTerm('Alternativ titel (Abchaziska)'), {
      message: 'Alternative title in Abkhazian',
    }).toHaveText(
      'Framtidens fiske: Status, trender och framtidsperspektiv gällande energiomställningen inom fisket med fokus på Norden odefinierad',
    );

    await expect(page.getByDefinitionTerm('Publikations-/Outputtyp'), {
      message: 'Output type',
    }).toHaveText('Rapport');

    const languages = page.getByDefinitionTerm('Språk');
    await expect(languages.getByText('Engelska'), {
      message: 'Language',
    }).toBeVisible();
    await expect(languages.getByText('Arabiska'), {
      message: 'Language',
    }).toBeVisible();
    await expect(languages.getByText('Athapaskiskt språk'), {
      message: 'Language',
    }).toBeVisible();

    // await expect(
    //   page.getByDefinitionTerm('Verk baserat på konstnärlig grund'),
    //   {
    //     message: 'Artistic work',
    //   },
    // ).toHaveText('Sant');

    await expect(page.getByDefinitionTerm('Typ av innehåll'), {
      message: 'Content type',
    }).toHaveText('Övrigt (populärvetenskap, debatt)');

    const abstract = page.getByDefinitionTerm('Abstract (Engelska)');
    await expect(abstract, { message: 'Truncated abstract' }).toHaveText(
      expectedAbstractTruncated,
    );

    await abstract.getByRole('button', { name: 'Visa mer' }).click();

    await expect(abstract, { message: 'Full abstract' }).toHaveText(
      expectedAbstractFull,
    );

    await expect(page.getByDefinitionTerm('Anteckning'), {
      message: 'Note',
    }).toHaveText('External note');

    await expect(page.getByDefinitionTerm('Utgivningsdatum'), {
      message: 'Publication date',
    }).toHaveText('2025');

    await expect(page.getByDefinitionTerm('DiVA-id'), {
      message: 'DiVA-id',
    }).toHaveText(recordId);
  });
});

const expectedAbstractTruncated = `The energy transition of the fishing sector has gained
increasing attention in recent years. With focus on Nordic countries, status,
trends, opportunities and challenges are summarized to provide recommendations for
how to effectively enable an energy transition towards carbon-neutral fisheries. Key...Visa mer`;

const expectedAbstractFull = `The energy transition of the fishing sector has gained
increasing attention in recent years. With focus on Nordic countries, status,
trends, opportunities and challenges are summarized to provide recommendations for
how to effectively enable an energy transition towards carbon-neutral fisheries. Key
challenges today include inadequate data collection and reporting of greenhouse gas
emissions, low uptake of available technologies, reversed financial incentives
fostering use of fossil fuels, and obstructing fishing regulations. To foster an
effective energy transition, short term (before 2030) and long-term actions (before
2040) are identified. Overall, co-developing effective roadmaps for the energy
transition of a highly diverse sector will be essential.

The energy transition of the fishing sector has gained increasing attention in
recent years. With focus on Nordic countries, status, trends, opportunities and
challenges are summarized to provide recommendations for how to effectively enable
an energy transition towards carbon-neutral fisheries. Key challenges today include
inadequate data collection and reporting of greenhouse gas emissions, low uptake of
available technologies, reversed financial incentives fostering use of fossil fuels,
and obstructing fishing regulations. To foster an effective energy transition, short
term (before 2030) and long-term actions (before 2040) are identified. Overall,
co-developing effective roadmaps for the energy transition of a highly diverse
sector will be essential.

The energy transition of the fishing sector has gained increasing attention in
recent years. With focus on Nordic countries, status, trends, opportunities and
challenges are summarized to provide recommendations for how to effectively enable
an energy transition towards carbon-neutral fisheries. Key challenges today include
inadequate data collection and reporting of greenhouse gas emissions, low uptake of
available technologies, reversed financial incentives fostering use of fossil fuels,
and obstructing fishing regulations. To foster an effective energy transition, short
term (before 2030) and long-term actions (before 2040) are identified. Overall,
co-developing effective roadmaps for the energy transition of a highly diverse
sector will be essential.Visa mindre`;
