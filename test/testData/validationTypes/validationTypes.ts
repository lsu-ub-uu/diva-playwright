export const validationTypes = [
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
