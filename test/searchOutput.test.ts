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

    await page.getByRole('searchbox').fill(recordTitle);

    await expect(await page.getByRole('searchbox')).toHaveValue(recordTitle);
    await page
      .getByRole('button', { name: 'divaClient_SearchButtonText', exact: true })
      .click();
    const encodedRecordTitle = encodeURIComponent(recordTitle).replaceAll(
      '%20',
      '\\+',
    );
    await expect(
      await page.getByText(recordTitle, { exact: true }),
    ).toBeVisible();
    await expect(page).toHaveURL(
      new RegExp(`.*\\/diva-output\\?q=${encodedRecordTitle}&start=1&rows=10`),
    );

    await page
      .getByRole('button', { name: 'divaClient_showFiltersText', exact: true })
      .click();
    await page
      .getByRole('textbox', { name: 'searchRecordIdTextVarText' })
      .fill(recordId);

    const oldId = 'oldId123';
    await page
      .getByRole('textbox', { name: 'oldIdSearchTextVarText' })
      .fill(oldId);

    await expect(page).toHaveURL(
      new RegExp(
        `.*\\/diva-output\\?q=${encodedRecordTitle}&start=1&rows=10&recordIdSearchTerm=${recordId}&oldIdSearchTerm=${oldId}`,
      ),
    );
  });
});
