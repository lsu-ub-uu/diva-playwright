import { expect } from '@playwright/test';
import { test } from './util/fixtures';
import { createUrl } from './util/createUrl';
import {
  getFirstDataAtomicValueWithNameInData,
  getFirstDataGroupWithNameInData,
} from './util/coraUtils';

test.describe('Search output', () => {
  test('Search for records', async ({ page, divaOutput }) => {
    const recordTitle = getFirstDataAtomicValueWithNameInData(
      getFirstDataGroupWithNameInData(divaOutput, 'titleInfo'),
      'title',
    );
    const recordId = getFirstDataAtomicValueWithNameInData(
      getFirstDataGroupWithNameInData(divaOutput, 'recordInfo'),
      'id',
    );

    await page.goto(createUrl('/diva-output'));

    await page.getByRole('textbox', { name: 'Fritext' }).fill(recordTitle);

    await expect(
      await page.getByRole('textbox', { name: 'Fritext' }),
    ).toHaveValue(recordTitle);
    await page.getByRole('button', { name: 'Sök', exact: true }).click();

    await expect(await page.getByText(recordId)).toBeVisible();
  });
});
