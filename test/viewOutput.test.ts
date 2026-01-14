import { getByDefinitionTerm, test } from './util/fixtures';
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
      'nameText',
    );

    await expect(authors.getByText('Sara Hornborg'), {
      message: 'Author Sara',
    }).toBeVisible();
    await expect(authors.getByText('Karl Gunnar Aarsæther'), {
      message: 'Author Karl',
    }).toBeVisible();
    await expect(authors.getByText('François Bastardie'), {
      message: 'Author François',
    }).toBeVisible();
    await expect(authors.getByText('Sepideh Jafarzadeh'), {
      message: 'Author Sepideh hidden',
    }).not.toBeVisible();

    await authors.getByRole('button', { name: 'divaClient_showMoreText' }).click();
    await expect(authors.getByText('Sepideh Jafarzadeh (Konstkopist)'), {
      message: 'Author Sepideh',
    }).toBeVisible();

    const organisations = page.getByDefinitionTerm(
      'Organisation som författare, redaktör eller annan roll',
    );
    await expect(
      organisations.getByText('Nordic Council of Ministers'),
    ).toBeVisible();
    await organisations.getByRole('button', { name: 'divaClient_showMoreText' }).click();
    await expect(organisations.getByText('(Författare)')).toBeVisible();

    await expect(page.getByDefinitionTerm('Antal upphovspersoner'), {
      message: 'Number of authors',
    }).toHaveText('12');

    await expect(page.getByDefinitionTerm('titleInfoText (abkLangItemText)'), {
      message: 'Alternative title in Abkhazian',
    }).toHaveText(
      'Ԥхьаҟатәи аԥсыӡкра: Скандинавиатәи арегион ахшыҩзышьҭра аҭаны аԥсыӡкраҿы аенергиа аиҭаҵра иазку аҭагылазаашьа, атрендқәа, ԥхьаҟатәи аперспективақәа еилкаам',
    );

    await expect(page.getByDefinitionTerm('titleInfoText (hebLangItemText)'), {
      message: 'Alternative title in Hebreiska',
    }).toHaveText(
      'דיג עתידי: מצב, מגמות ופרספקטיבות עתידיות בנוגע למעבר האנרגטי של דיג בדגש על מדינות סקנדינביות',
    );

    await expect(page.getByDefinitionTerm('Publikationstyp'), {
      message: 'Output type',
    }).toHaveText('Rapport');

    await expect(page.getByDefinitionTerm('Baserat på konstnärlig grund'), {
      message: 'Artistic work',
    }).toHaveText('Sant');

    const languages = page.getByDefinitionTerm('languageTermText');
    await expect(languages.getByText('engValueText'), {
      message: 'Language',
    }).toBeVisible();
    await expect(languages.getByText('araValueText'), {
      message: 'Language',
    }).toBeVisible();
    await expect(languages.getByText('athValueText'), {
      message: 'Language',
    }).toBeVisible();

    await expect(page.getByDefinitionTerm('Typ av innehåll'), {
      message: 'Content type',
    }).toHaveText('Övrigt (populärvetenskap, debatt)');

    const abstractEng = page.getByDefinitionTerm('abstractText (engLangItemText)');
    await expect(abstractEng, { message: 'Truncated abstract' }).toHaveText(
      expectedAbstractTruncatedEng,
    );

    await abstractEng.getByRole('button', { name: 'divaClient_showMoreText' }).click();

    await expect(abstractEng, { message: 'Full abstract' }).toHaveText(
      expectedAbstractFullEng,
    );

    await expect(page.getByDefinitionTerm('typeOfResourceText'), {
      message: 'Type of resource',
    }).toHaveText('Artefakt');

    const type = page.getByDefinitionTerm('typeText');
    await expect(type.getByText('Partitur', { exact: true }), {
      message: 'Type partitur',
    }).toBeVisible();

    await expect(type.getByText('Partiture', { exact: true }), {
      message: 'Type partiture',
    }).toBeVisible();

    const material = page.getByDefinitionTerm('materialText');
    await expect(material.getByText('sten'), {
      message: 'Material',
    }).toBeVisible();

    await expect(material.getByText('gips'), {
      message: 'Material',
    }).toBeVisible();

    await expect(material.getByText('stone'), {
      message: 'Material',
    }).toBeVisible();

    await expect(page.getByDefinitionTerm('techniqueText'), {
      message: 'Technique',
    }).toHaveText('akvarell');

    await expect(page.getByDefinitionTerm('sizeText'), {
      message: 'Size',
    }).toHaveText('130*20cm');

    await expect(page.getByDefinitionTerm('durationText'), {
      message: 'Duration',
    }).toHaveText('10h 23m 05s');

    await expect(page.getByDefinitionTerm('extentText'), {
      message: 'Physical Description',
    }).toHaveText('239sidor');

    await expect(page.getByDefinitionTerm('noteText (sweLangItemText)'), {
      message: 'Context swedish',
    }).toHaveText('Lorem ipsum');
    await expect(page.getByDefinitionTerm('noteText (iceLangItemText)'), {
      message: 'Context icelandic',
    }).toHaveText('Loremur ipsumur');
    await expect(page.getByDefinitionTerm('patentCountryText'), {
      message: 'Patent country',
    }).toHaveText('Sverige');
    await expect(page.getByDefinitionTerm('relatedItemText'), {
      message: 'Conference',
    }).toHaveText('Nordic.js 2025');
    await expect(page.getByDefinitionTerm('relatedItemText'), {
      message: 'Publication channel',
    }).toHaveText('Radio');
    await expect(page.getByText('Strategiskt initiativ')).toBeVisible();
    await expect(page.getByText('diabetes')).toBeVisible();
    await expect(page.getByText('molekylär biovetenskap')).toBeVisible();

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
    await expect(page.getByDefinitionTerm('Kurs/ämne'), {
      message: 'Course',
    }).toHaveText('Egyptologi');
    await expect(page.getByDefinitionTerm('Utbildningsprogram'), {
      message: 'Program',
    }).toHaveText('Arkeologlinjen');

    // Journal
    const journal = page.getByRole('region', { name: 'Tidskrift' });
    await expect(
      journal.getByRole('heading', { level: 2, name: 'Tidskrift' }),
    ).toBeVisible();
    await expect(getByDefinitionTerm(journal, 'Titel'), {
      message: 'Journal title',
    }).toHaveText("Nature: It's about nature and stuff");
    await expect(getByDefinitionTerm(journal, 'PISSN'), {
      message: 'Journal PISSN',
    }).toBeVisible();
    await expect(getByDefinitionTerm(journal, 'EISSN'), {
      message: 'Journal EISSN',
    }).toBeVisible();
    await expect(getByDefinitionTerm(journal, 'Volym'), {
      message: 'Journal volume',
    }).toHaveText('586');
    await expect(getByDefinitionTerm(journal, 'Utgivningsnummer'), {
      message: 'Journal issue',
    }).toHaveText('1');
    await expect(getByDefinitionTerm(journal, 'Artikelnummer'), {
      message: 'Journal article number',
    }).toHaveText('1234');
    await expect(getByDefinitionTerm(journal, 'Startsida'), {
      message: 'Journal start page',
    }).toHaveText('12');
    await expect(getByDefinitionTerm(journal, 'Slutsida'), {
      message: 'Journal end page',
    }).toHaveText('34');

    // Book
    await expect(
      page.getByRole('heading', { level: 2, name: 'Bok' }),
    ).toBeVisible();
    const book = page.getByRole('region', { name: 'Bok' });
    await expect(getByDefinitionTerm(book, 'Titel'), {
      message: 'Book title',
    }).toHaveText('BookTitle: BookSubtitle');
    await expect(
      book.getByRole('link', { name: 'BookTitle: BookSubtitle' }),
    ).toBeVisible();
    await expect(getByDefinitionTerm(book, 'ISBN (print)'), {
      message: 'Book ISBN print',
    }).toHaveText('978-92-893-8293-9');
    await expect(getByDefinitionTerm(book, 'Startsida'), {
      message: 'Book start page',
    }).toHaveText('45');
    await expect(getByDefinitionTerm(book, 'Slutsida'), {
      message: 'Book end page',
    }).toHaveText('67');

    const bookSeries = book.getByRole('region', { name: 'Serie' });
    await expect(bookSeries.getByRole('heading', { level: 3, name: 'Serie' }), {
      message: 'Book series heading',
    }).toBeVisible();
    await expect(getByDefinitionTerm(bookSeries, 'Serie'), {
      message: 'Book series link',
    }).toHaveText(
      'Lecture Notes in Computer Science: Artificial Intelligence and Bioinformatics',
    );
    await expect(getByDefinitionTerm(bookSeries, 'Nummer i serie'), {
      message: 'Book series part',
    }).toHaveText('14');

    // Conference publication
    await expect(page.getByRole('heading', { level: 2, name: 'Proceeding' }), {
      message: 'Conference publication heading',
    }).toBeVisible();
    const conferencePublication = page.getByRole('region', {
      name: 'Proceeding',
    });
    await expect(getByDefinitionTerm(conferencePublication, 'Proceeding'), {
      message: 'Conference publication proceeding link',
    }).toHaveText('BookTitle: BookSubtitle');
    await expect(getByDefinitionTerm(conferencePublication, 'Titel'), {
      message: 'Conference publication title',
    }).toHaveText('ConferenceBookTitle: ConferenceBookSubtitle');
    await expect(getByDefinitionTerm(conferencePublication, 'Redaktör'), {
      message: 'Conference publication editor',
    }).toHaveText('Edited by Sara Hornborg and Karl Gunnar');
    await expect(getByDefinitionTerm(conferencePublication, 'ISBN (print)'), {
      message: 'Conference publication ISBN print',
    }).toHaveText('978-92-893-8293-9');
    await expect(getByDefinitionTerm(conferencePublication, 'DOI'), {
      message: 'Conference publication DOI',
    }).toHaveText('10.1234/conference.doi/5678');
    await expect(getByDefinitionTerm(conferencePublication, 'Startsida'), {
      message: 'Conference publication start page',
    }).toHaveText('89');
    await expect(getByDefinitionTerm(conferencePublication, 'Slutsida'), {
      message: 'Conference publication end page',
    }).toHaveText('101');
    const conferenceSeries = conferencePublication.getByRole('region', {
      name: 'Serie',
    });
    await expect(
      conferenceSeries.getByRole('heading', { level: 3, name: 'Serie' }),
      {
        message: 'Conference series heading',
      },
    ).toBeVisible();
    await expect(getByDefinitionTerm(conferenceSeries, 'Serie'), {
      message: 'Conference series link',
    }).toHaveText(
      'Lecture Notes in Computer Science: Artificial Intelligence and Bioinformatics',
    );
    await expect(getByDefinitionTerm(conferenceSeries, 'Nummer i serie'), {
      message: 'Conference series part',
    }).toHaveText('7');

    // Series
    const series = page.locator('section', {
      has: page.getByRole('heading', { level: 2, name: 'Serie' }),
    });
    await expect(series.getByRole('heading', { level: 2, name: 'Serie' }), {
      message: 'Series heading',
    }).toBeVisible();
    await expect(getByDefinitionTerm(series, 'Titel'), {
      message: 'Series title',
    }).toHaveText('A song of Ice and Fire');
    await expect(getByDefinitionTerm(series, 'EISSN'), {
      message: 'Series EISSN',
    }).toHaveText('9988-7766');
    await expect(getByDefinitionTerm(series, 'PISSN'), {
      message: 'Series PISSN',
    }).toHaveText('1234-9876');
    await expect(getByDefinitionTerm(series, 'Nummer i serie'), {
      message: 'Series part',
    }).toHaveText('5');

    // Project
    const project = page.getByRole('region', { name: 'Projekt' });
    await expect(project.getByRole('heading', { level: 2, name: 'Projekt' }), {
      message: 'Project heading',
    }).toBeVisible();
    await expect(getByDefinitionTerm(project, 'Projekt'), {
      message: 'Linked project',
    }).toHaveText(
      'Deep Learning for Time Series Forecasting: The Electric Load Case',
    );

    // Funder
    const funder = page.getByRole('region', { name: 'Finansiär' });
    await expect(funder.getByRole('heading', { level: 2, name: 'Finansiär' }), {
      message: 'Funder heading',
    }).toBeVisible();
    await expect(getByDefinitionTerm(funder, 'Finansiär'), {
      message: 'Linked funder',
    }).toHaveText('Vetenskapsrådet');
    await expect(getByDefinitionTerm(funder, 'Projekt-Id'), {
      message: 'Funder project id',
    }).toHaveText('VR 2019-01234');

    // Related
    await expect(page.getByDefinitionTerm('Relaterad publikation i DiVA'), {
      message: 'Related publication',
    }).toHaveText('BookTitle: BookSubtitle');
    await expect(page.getByDefinitionTerm('Retracted publikation'), {
      message: 'Retracted publication',
    }).toHaveText('BookTitle: BookSubtitle');
    await expect(page.getByDefinitionTerm('Delarbete'), {
      message: 'Constituent',
    }).toHaveText('BookTitle: BookSubtitle');

    // Sidebar
    await expect(page.getByDefinitionTerm('Åtkomstvillkor'), {
      message: 'Access condition',
    }).toHaveText('Gratis');

    // Origin info
    const place = page.getByDefinitionTerm('Ort');
    await expect(place.getByText('Stockholm'), {
      message: 'Place of publication',
    }).toBeVisible();
    await expect(place.getByText('Uppsala'), {
      message: 'Place of publication',
    }).toBeVisible();
    await expect(page.getByDefinitionTerm('Utgivningsdatum'), {
      message: 'Publication date',
    }).toHaveText('2025');
    await expect(page.getByDefinitionTerm('Upphovsrättsdatum'), {
      message: 'Copyright date',
    }).toHaveText('2024-10-12');
    await expect(page.getByDefinitionTerm('Datum för online först'), {
      message: 'Online first date',
    }).toHaveText('1310-01-02');
    await expect(page.getByDefinitionTerm('Impressum (äldre tryck)'), {
      message: 'Imprint',
    }).toHaveText('Hamburg, Tyskland');

    const publisher = page.getByDefinitionTerm('Förlag');
    await expect(publisher.getByText('My Linked Publisher'), {
      message: 'Linked publisher',
    }).toBeVisible();
    await expect(publisher.getByText('Penguin'), {
      message: 'Publisher Penguin',
    }).toBeVisible();
    await expect(publisher.getByText('Bloomsbury'), {
      message: 'Publisher Bloomsbury',
    }).toBeVisible();

    await expect(page.getByDefinitionTerm('Upplaga'), {
      message: 'Edition',
    }).toHaveText('First edition');
    await expect(page.getByDefinitionTerm('Datum för godkännande av patent'), {
      message: 'Patent approval date',
    }).toHaveText('2012-10-23');

    const patentHolder = page.getByDefinitionTerm('Patentinnehavare');
    await expect(patentHolder.getByText('Uppsala universitet'), {
      message: 'Patent holder name',
    }).toBeVisible();

    await patentHolder.getByRole('button', { name: 'divaClient_showMoreText' }).click();
    await expect(patentHolder.getByText('048a87296'), {
      message: 'Patent holder identifier',
    }).toBeVisible();
    await expect(
      patentHolder.getByText('Ett universitet som ligger i uppsala'),
      {
        message: 'Patent holder description',
      },
    ).toBeVisible();

    const location = page.getByDefinitionTerm('URL');
    await expect(location.getByRole('link', { name: 'Google' }), {
      message: 'Location Google',
    }).toHaveAttribute('href', 'https://www.google.com');
    await expect(location.getByRole('link', { name: 'Uppsala Universitet' }), {
      message: 'Location Uppsala Universitet',
    }).toHaveAttribute('href', 'https://www.uu.se');

    await expect(
      page
        .getByDefinitionTerm('Beställningslänk')
        .getByRole('link', { name: 'Google' }),
      {
        message: 'Order link',
      },
    ).toHaveAttribute('href', 'https://google.com');

    // Identifiers
    const identifiers = page.getByRole('region', { name: 'Identifierare' });
    await expect(
      identifiers.getByRole('heading', { level: 2, name: 'Identifierare' }),
    ).toBeVisible();
    await expect(getByDefinitionTerm(identifiers, 'DiVA-id'), {
      message: 'DiVA-id',
    }).toHaveText(recordId);
    await expect(getByDefinitionTerm(identifiers, 'ISBN (print)'), {
      message: 'ISBN print',
    }).toHaveText('978-92-893-8293-9');
    await expect(getByDefinitionTerm(identifiers, 'ISBN (online)'), {
      message: 'ISBN online',
    }).toHaveText('978-92-893-8293-2');
    await expect(getByDefinitionTerm(identifiers, 'ISRN'), {
      message: 'ISRN',
    }).toHaveText('978-92-893-8293-9');
    await expect(getByDefinitionTerm(identifiers, 'ISMN (print)'), {
      message: 'ISMN print',
    }).toHaveText('9790260000438');
    await expect(getByDefinitionTerm(identifiers, 'ISMN (online)'), {
      message: 'ISMN online',
    }).toHaveText('9790260000432');
    await expect(getByDefinitionTerm(identifiers, 'DOI'), {
      message: 'DOI',
    }).toHaveText('10.6027/nord2025-019');
    await expect(getByDefinitionTerm(identifiers, 'PubMed'), {
      message: 'PubMed',
    }).toHaveText('10097079');
    await expect(getByDefinitionTerm(identifiers, 'Scopus'), {
      message: 'Scopus',
    }).toHaveText('2-s2.0-12');
    await expect(getByDefinitionTerm(identifiers, 'Arkivnummer'), {
      message: 'Archive number',
    }).toHaveText('sa12456456');
    await expect(getByDefinitionTerm(identifiers, 'OpenAlex'), {
      message: 'OpenAlex',
    }).toHaveText('W3123306174');
    await expect(getByDefinitionTerm(identifiers, 'Libris Id'), {
      message: 'Libris Id',
    }).toHaveText('onr:19769763');
    await expect(getByDefinitionTerm(identifiers, 'Lokalt Id'), {
      message: 'Lokalt Id',
    }).toHaveText('123456');
    await expect(getByDefinitionTerm(identifiers, 'Patentnummer'), {
      message: 'Patentnummer',
    }).toHaveText('SE 7713829-5');

    const keywords = page.getByRole('list', {
      name: 'Nyckelord (Albanska)',
    });
    await expect(keywords.getByRole('link', { name: 'Digitization' }), {
      message: 'Keyword Digitization',
    }).toBeVisible();

    await expect(keywords.getByRole('link', { name: 'Integration' }), {
      message: 'Keyword Integration',
    }).toBeVisible();

    await expect(
      keywords.getByRole('link', { name: 'Welfare and Gender Equality' }),
      {
        message: 'Keyword Welfare and Gender Equality',
      },
    ).toBeVisible();

    const ssif = page.getByRole('list', {
      name: 'Nationell ämneskategori (SSIF)',
    });
    await expect(ssif.getByRole('link', { name: 'Naturvetenskap' }), {
      message: 'SSIF Naturvetenskap',
    }).toBeVisible();

    await expect(
      page
        .getByRole('list', {
          name: 'Lokalt ämne',
        })
        .getByText('Mikrobiologi'),
      {
        message: 'Subject',
      },
    ).toBeVisible();

    const sdg = page.getByRole('list', {
      name: 'Hållbar utveckling',
    });
    await expect(sdg.getByRole('link', { name: 'Ingen Fattigdom' }), {
      message: 'SDG Ingen Fattigdom',
    }).toBeVisible();
    await expect(sdg.getByRole('link', { name: 'Ingen Hunger' }), {
      message: 'Ingen Hunger',
    }).toBeVisible();

    await expect(
      page
        .getByRole('list', { name: 'DiVA-lokal generisk uppmärkning' })
        .getByText('Extra viktig publikation'),
      {
        message: 'Local generic markup',
      },
    ).toBeVisible();

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
