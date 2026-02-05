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

    await expect(page).toHaveURL((url) => {
      const params = url.searchParams;
      return (
        params.get('q') === recordTitle &&
        params.get('start') === '1' &&
        params.get('rows') === '20'
      );
    });

    await expect(
      await page.getByText(recordTitle, { exact: true }),
    ).toBeVisible();

    await page
      .getByRole('combobox', { name: 'divaClient_paginationRowsPerPageText' })
      .first()
      .selectOption({ label: '40' });

    await expect(page).toHaveURL((url) => {
      const params = url.searchParams;
      return (
        params.get('q') === recordTitle &&
        params.get('start') === '1' &&
        params.get('rows') === '40'
      );
    });

    await page
      .getByRole('textbox', { name: 'searchRecordIdTextVarText' })
      .fill(recordId);

    const oldId = 'oldId123';
    await page
      .getByRole('textbox', { name: 'oldIdSearchTextVarText' })
      .fill(oldId);

    await expect(page).toHaveURL((url) => {
      const params = url.searchParams;
      return (
        params.get('q') === recordTitle &&
        params.get('start') === '1' &&
        params.get('rows') === '40' &&
        params.get('oldIdSearchTerm') === oldId &&
        params.get('recordIdSearchTerm') === recordId
      );
    });
  });
});
