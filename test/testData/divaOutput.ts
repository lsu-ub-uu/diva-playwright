import { faker } from '@faker-js/faker';
import type { DataGroup } from '../util/coraTypes';

export const createDivaOutput = (permissionUnit: string = 'uu'): DataGroup => ({
  name: 'output',
  children: [
    {
      name: 'recordInfo',
      children: [
        {
          name: 'validationType',
          children: [
            { name: 'linkedRecordType', value: 'validationType' },
            { name: 'linkedRecordId', value: 'publication_report' },
          ],
        },
        {
          name: 'dataDivider',
          children: [
            { name: 'linkedRecordType', value: 'system' },
            { name: 'linkedRecordId', value: 'divaData' },
          ],
        },
        {
          name: 'permissionUnit',
          children: [
            { name: 'linkedRecordType', value: 'permissionUnit' },
            { name: 'linkedRecordId', value: permissionUnit },
          ],
        },
        { name: 'visibility', value: 'published' },
      ],
    },
    {
      name: 'dataQuality',
      value: '2026',
    },
    {
      name: 'genre',
      value: 'publication_report',
      attributes: { type: 'outputType' },
    },
    {
      name: 'language',
      repeatId: '0',
      children: [
        {
          name: 'languageTerm',
          value: 'eng',
          attributes: { type: 'code', authority: 'iso639-2b' },
        },
      ],
    },
    {
      name: 'artisticWork',
      value: 'false',
      attributes: { type: 'outputType' },
    },
    { name: 'genre', value: 'ref', attributes: { type: 'contentType' } },
    {
      name: 'titleInfo',
      children: [{ name: 'title', value: faker.book.title() }],
      attributes: { lang: 'swe' },
    },
    {
      name: 'originInfo',
      children: [
        {
          name: 'dateIssued',
          children: [
            {
              name: 'year',
              value: faker.date.recent().getFullYear().toString(),
            },
          ],
        },
      ],
    },
    {
      name: 'classification',
      repeatId: '0',
      value: '10302',
      attributes: { authority: 'ssif' },
    },
    { name: 'adminInfo', children: [{ name: 'reviewed', value: 'true' }] },
  ],
});
