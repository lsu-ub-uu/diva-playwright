import { expect } from '@playwright/test';
import {
  getFirstDataAtomicValueWithNameInData,
  getFirstDataGroupWithNameInData,
} from './util/coraUtils';
import { test } from './util/fixtures';
import { goToPage } from './util/goToPage';

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

    await goToPage(page, '/diva-output');

    await page.getByRole('textbox', { name: 'Fritext' }).fill(recordTitle);

    await expect(
      await page.getByRole('textbox', { name: 'Fritext' }),
    ).toHaveValue(recordTitle);
    await page.getByRole('button', { name: 'Sök', exact: true }).click();

    await expect(await page.getByText(recordId, {exact: true})).toBeVisible();
  });
});
