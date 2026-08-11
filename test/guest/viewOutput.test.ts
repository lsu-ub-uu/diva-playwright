import { test } from '../util/fixtures';
import { expect } from '@playwright/test';
import { createUrl } from '../util/createUrl';
import { validationTypes } from '../testData/validationTypes/validationTypes';
import {
  getFirstDataAtomicValueWithNameInData,
  getFirstDataGroupWithNameInData,
} from '../util/coraUtils';

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
