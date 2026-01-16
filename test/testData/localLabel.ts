import type { DataGroup } from '../util/coraTypes';

export const createLocalLabel = (permissionUnit = 'uu'): DataGroup => ({
  name: 'localLabel',
  children: [
    {
      name: 'recordInfo',
      children: [
        {
          name: 'validationType',
          children: [
            { name: 'linkedRecordType', value: 'validationType' },
            { name: 'linkedRecordId', value: 'diva-localLabel' },
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
      ],
    },
    { name: 'localLabel', value: 'Lorem ipsum' },
    { name: 'description', value: 'Lorem ipsum dolor sit amet' },
  ],
});
