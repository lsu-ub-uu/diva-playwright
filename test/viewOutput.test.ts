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

    await expect(page.getByRole('heading', { level: 1 }), {
      message: 'Title',
    }).toHaveText(
      'Future fisheries: Status, trends and future perspectives concerning the energy transition of fisheries with focus on Nordic countries',
    );

    const authors = page.getByDefinitionTerm(
      'Författare, redaktör eller annan roll',
    );

    await expect(authors.getByText('Sara Hornborg'), {
      message: 'Author Sara',
    }).toBeVisible();
    await expect(authors.getByText('Karl Gunnar Aarsæther'), {
      message: 'Author Karl',
    }).toBeVisible();
    await expect(authors.getByText('François Bastardie (Författare)'), {
      message: 'Author François',
    }).toBeVisible();
    await expect(authors.getByText('Sepideh Jafarzadeh (Konstkopist)'), {
      message: 'Author Sepideh hidden',
    }).not.toBeVisible();

    await authors.getByRole('button', { name: 'Visa mer' }).click();
    await expect(authors.getByText('Sepideh Jafarzadeh (Konstkopist)'), {
      message: 'Author Sepideh',
    }).toBeVisible();

    await expect(
      page.getByDefinitionTerm(
        'Organisation som författare, redaktör eller annan roll',
      ),
      { message: 'Author organization' },
    ).toHaveText('Nordic Council of Ministers (Författare)');

    await expect(page.getByDefinitionTerm('Antal upphovspersoner'), {
      message: 'Number of authors',
    }).toHaveText('12');

    await expect(page.getByDefinitionTerm('Alternativ titel (Abchaziska)'), {
      message: 'Alternative title in Abkhazian',
    }).toHaveText(
      'Ԥхьаҟатәи аԥсыӡкра: Скандинавиатәи арегион ахшыҩзышьҭра аҭаны аԥсыӡкраҿы аенергиа аиҭаҵра иазку аҭагылазаашьа, атрендқәа, ԥхьаҟатәи аперспективақәа еилкаам',
    );

    await expect(page.getByDefinitionTerm('Alternativ titel (Hebreiska)'), {
      message: 'Alternative title in Hebreiska',
    }).toHaveText(
      'דיג עתידי: מצב, מגמות ופרספקטיבות עתידיות בנוגע למעבר האנרגטי של דיג בדגש על מדינות סקנדינביות',
    );

    await expect(page.getByDefinitionTerm('Publikations-/Outputtyp'), {
      message: 'Output type',
    }).toHaveText('Rapport');

    await expect(page.getByDefinitionTerm('Baserat på konstnärlig grund'), {
      message: 'Artistic work',
    }).toHaveText('Sant');

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

    await expect(page.getByDefinitionTerm('Typ av innehåll'), {
      message: 'Content type',
    }).toHaveText('Övrigt (populärvetenskap, debatt)');

    const abstractEng = page.getByDefinitionTerm('Abstract (Engelska)');
    await expect(abstractEng, { message: 'Truncated abstract' }).toHaveText(
      expectedAbstractTruncatedEng,
    );

    await abstractEng.getByRole('button', { name: 'Visa mer' }).click();

    await expect(abstractEng, { message: 'Full abstract' }).toHaveText(
      expectedAbstractFullEng,
    );

    await expect(page.getByDefinitionTerm('Typ av resurs'), {
      message: 'Type of resource',
    }).toHaveText('Artefakt');

    const type = page.getByDefinitionTerm('Typ');
    await expect(type.getByText('Partitur', { exact: true }), {
      message: 'Type partitur',
    }).toBeVisible();

    await expect(type.getByText('Partiture', { exact: true }), {
      message: 'Type partiture',
    }).toBeVisible();

    const material = page.getByDefinitionTerm('Material');
    await expect(material.getByText('sten'), {
      message: 'Material',
    }).toBeVisible();

    await expect(material.getByText('gips'), {
      message: 'Material',
    }).toBeVisible();

    await expect(material.getByText('stone'), {
      message: 'Material',
    }).toBeVisible();

    await expect(page.getByDefinitionTerm('Teknik'), {
      message: 'Technique',
    }).toHaveText('akvarell');

    await expect(page.getByDefinitionTerm('Mått'), {
      message: 'Size',
    }).toHaveText('130*20cm');

    await expect(page.getByDefinitionTerm('Längd'), {
      message: 'Duration',
    }).toHaveText('10h 23m 05s');

    await expect(page.getByDefinitionTerm('Fysisk beskrivning'), {
      message: 'Physical Description',
    }).toHaveText('239sidor');

    await expect(page.getByDefinitionTerm('Akademisk termin'), {
      message: 'Academic term',
    }).toHaveText('VT 1234');
    await expect(page.getByDefinitionTerm('Externt samarbete'), {
      message: 'External collaboration',
    }).toHaveText('Externt Namn');
    await expect(page.getByDefinitionTerm('Utfärdare av akademisk examen'), {
      message: 'Degree issuer',
    }).toContainText('Uppsala Univertitet');
    await expect(page.getByDefinitionTerm('Handledare'), {
      message: 'Supervisor',
    }).toContainText('Supervisorförnamn Efternamn');
    await expect(page.getByDefinitionTerm('Examinator'), {
      message: 'Examiner',
    }).toContainText('Examinerförnamn Efternamn');
    await expect(page.getByDefinitionTerm('Opponent'), {
      message: 'Opponent',
    }).toContainText('Opponentförnamn Efternamn');

    await expect(page.getByDefinitionTerm('Examensnivå'), {
      message: 'Exam level',
    }).toHaveText('Högskoleexamen');
    await expect(page.getByDefinitionTerm('Högskolepoäng'), {
      message: 'Credits',
    }).toHaveText('7,5 hp');

    // Högersida

    await expect(page.getByDefinitionTerm('Utgivningsdatum'), {
      message: 'Publication date',
    }).toHaveText('2025');

    await expect(page.getByDefinitionTerm('DiVA-id'), {
      message: 'DiVA-id',
    }).toHaveText(recordId);

    // Additional <dd> checks
    await expect(page.getByDefinitionTerm('ISBN (print)'), {
      message: 'ISBN print',
    }).toHaveText('978-92-893-8293-9');
    await expect(page.getByDefinitionTerm('ISBN (online)'), {
      message: 'ISBN online',
    }).toHaveText('978-92-893-8293-2');
    await expect(page.getByDefinitionTerm('ISRN'), {
      message: 'ISRN',
    }).toHaveText('978-92-893-8293-9');
    await expect(page.getByDefinitionTerm('ISMN (print)'), {
      message: 'ISMN print',
    }).toHaveText('9790260000438');
    await expect(page.getByDefinitionTerm('ISMN (online)'), {
      message: 'ISMN online',
    }).toHaveText('9790260000432');
    await expect(page.getByDefinitionTerm('DOI'), {
      message: 'DOI',
    }).toHaveText('10.6027/nord2025-019');
    await expect(page.getByDefinitionTerm('PubMed'), {
      message: 'PubMed',
    }).toHaveText('10097079');
    await expect(page.getByDefinitionTerm('Scopus'), {
      message: 'Scopus',
    }).toHaveText('2-s2.0-12');
    await expect(page.getByDefinitionTerm('OpenAlex'), {
      message: 'OpenAlex',
    }).toHaveText('W3123306174');
    await expect(page.getByDefinitionTerm('Libris Id'), {
      message: 'Libris Id',
    }).toHaveText('onr:19769763');
    await expect(page.getByDefinitionTerm('Lokalt Id'), {
      message: 'Lokalt Id',
    }).toHaveText('123456');
    await expect(page.getByDefinitionTerm('Patentnummer'), {
      message: 'Patentnummer',
    }).toHaveText('SE 7713829-5');

    await expect(page.getByDefinitionTerm('Anteckning'), {
      message: 'Note',
    }).toHaveText('External note');
  });
});

const expectedAbstractTruncatedEng = `The energy transition of the fishing sector has gained
increasing attention in recent years. With focus on Nordic countries, status,
trends, opportunities and challenges are summarized to provide recommendations for
how to effectively enable an energy transition towards carbon-neutral fisheries. Key...Visa mer`;

const expectedAbstractFullEng = `The energy transition of the fishing sector has gained
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
