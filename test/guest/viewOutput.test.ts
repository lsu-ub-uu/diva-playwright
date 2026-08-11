import { test } from '../util/fixtures';
import { expect } from '@playwright/test';
import { createUrl } from '../util/createUrl';
import { validationTypes } from '../testData/validationTypes/validationTypes';
import {
  getFirstDataAtomicValueWithNameInData,
  getFirstDataGroupWithNameInData,
} from '../util/coraUtils';

const intellectualPropertyPatentFunction = () => {};
const conferenceProceedingFunction = () => {};
const publicationLicentiateThesisCompilationFunction = () => {};
const publicationNewspaperArticleFunction = () => {};
const conferencePaperFunction = () => {};
const publicationCriticalEditionFunction = () => {};
const publicationReportFunction = () => {};
const publicationBookChapterFunction = () => {};
const publicationJournalArticleFunction = () => {};
const divaDissertationFunction = () => {};
const publicationLicentiateThesisMonographFunction = () => {};
const artisticWorkOriginalCreativeWorkFunction = () => {};
const publicationReviewArticleFunction = () => {};
const publicationReportChapterFunction = () => {};
const divaDegreeProjectFunction = () => {};
const publicationEditorialLetterFunction = () => {};
const publicationEncyclopediaEntryFunction = () => {};
const conferencePosterFunction = () => {};
const publicationEditedBookFunction = () => {};
const artisticWorkArtisticThesisFunction = () => {};
const publicationBookReviewFunction = () => {};
const conferenceOtherFunction = () => {};
const publicationMagazineArticleFunction = () => {};
const publicationPreprintFunction = () => {};
const publicationBookFunction = () => {};
const divaManuscriptFunction = () => {};
const publicationOtherFunction = () => {};
const publicationWorkingPaperFunction = () => {};
const publicationForewordAfterwordFunction = () => {};
const publicationDoctoralThesisMonographFunction = () => {};
const publicationDoctoralThesisCompilationFunction = () => {};

const validationTypesForOutput = [
  {
    validationType: 'intellectual-property_patent',
    function: intellectualPropertyPatentFunction(),
  },
  {
    validationType: 'conference_proceeding',
    function: conferenceProceedingFunction(),
  },
  {
    validationType: 'publication_licentiate-thesis-compilation',
    function: publicationLicentiateThesisCompilationFunction(),
  },
  {
    validationType: 'publication_newspaper-article',
    function: publicationNewspaperArticleFunction(),
  },
  {
    validationType: 'conference_paper',
    function: conferencePaperFunction(),
  },
  {
    validationType: 'publication_critical-edition',
    function: publicationCriticalEditionFunction(),
  },
  {
    validationType: 'publication_report',
    function: publicationReportFunction(),
  },
  {
    validationType: 'publication_book-chapter',
    function: publicationBookChapterFunction(),
  },
  {
    validationType: 'publication_journal-article',
    function: publicationJournalArticleFunction(),
  },
  {
    validationType: 'diva_dissertation',
    function: divaDissertationFunction(),
  },
  {
    validationType: 'publication_licentiate-thesis-monograph',
    function: publicationLicentiateThesisMonographFunction(),
  },
  {
    validationType: 'artistic-work_original-creative-work',
    function: artisticWorkOriginalCreativeWorkFunction(),
  },
  {
    validationType: 'publication_review-article',
    function: publicationReviewArticleFunction(),
  },
  {
    validationType: 'publication_report-chapter',
    function: publicationReportChapterFunction(),
  },
  {
    validationType: 'diva_degree-project',
    function: divaDegreeProjectFunction(),
  },
  {
    validationType: 'publication_editorial-letter',
    function: publicationEditorialLetterFunction(),
  },
  {
    validationType: 'publication_encyclopedia-entry',
    function: publicationEncyclopediaEntryFunction(),
  },
  {
    validationType: 'conference_poster',
    function: conferencePosterFunction(),
  },
  {
    validationType: 'publication_edited-book',
    function: publicationEditedBookFunction(),
  },
  {
    validationType: 'artistic-work_artistic-thesis',
    function: artisticWorkArtisticThesisFunction(),
  },
  {
    validationType: 'publication_book-review',
    function: publicationBookReviewFunction(),
  },
  {
    validationType: 'conference_other',
    function: conferenceOtherFunction(),
  },
  {
    validationType: 'publication_magazine-article',
    function: publicationMagazineArticleFunction(),
  },
  {
    validationType: 'publication_preprint',
    function: publicationPreprintFunction(),
  },
  {
    validationType: 'publication_book',
    function: publicationBookFunction(),
  },
  {
    validationType: 'diva_manuscript',
    function: divaManuscriptFunction(),
  },
  {
    validationType: 'publication_other',
    function: publicationOtherFunction(),
  },
  {
    validationType: 'publication_working-paper',
    function: publicationWorkingPaperFunction(),
  },
  {
    validationType: 'publication_foreword-afterword',
    function: publicationForewordAfterwordFunction(),
  },
  {
    validationType: 'publication_doctoral-thesis-monograph',
    function: publicationDoctoralThesisMonographFunction(),
  },
  {
    validationType: 'publication_doctoral-thesis-compilation',
    function: publicationDoctoralThesisCompilationFunction(),
  },
];

test.describe('View output', () => {
  validationTypes.forEach(({ name, validationType }) => {
    test(`View ${name}`, async ({ page, divaOutputFactory }) => {
      const divaOutput = await divaOutputFactory(`${validationType}.xml`);

      const recordId = getFirstDataAtomicValueWithNameInData(
        getFirstDataGroupWithNameInData(divaOutput, 'recordInfo'),
        'id',
      );

      await page.goto(createUrl(`/diva-output/${recordId}`));

      // Title
      await expect(page.getByRole('heading', { level: 1 }), {
        message: 'Title',
      }).toHaveText('TestTitle: TestSubtitle');
    });
  });
});
