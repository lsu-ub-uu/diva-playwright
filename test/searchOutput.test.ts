import { expect, type Locator, type Page } from '@playwright/test';
import {
  getFirstDataAtomicValueWithNameInData,
  getFirstDataGroupWithNameInData,
} from './util/coraUtils';
import { test } from './util/fixtures';
import { goToPageAndWaitForHydration } from './util/goToPage';

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

    await goToPageAndWaitForHydration(page, '/diva-output');

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
      .getByRole('textbox', { name: 'searchRecordIdDivaTextVarText' })
      .fill(recordId);

    const genericId = 'genericId123';
    await page
      .getByRole('textbox', { name: 'genericIdSearchTextVarText' })
      .fill(genericId);

    await selectComboboxOption(
      page,
      'ssifSearchCollectionVarText',
      '101ItemText',
      '101',
    );

    await expect(page).toHaveURL((url) => {
      const params = url.searchParams;
      return (
        params.get('q') === recordTitle &&
        params.get('start') === '1' &&
        params.get('rows') === '40' &&
        params.get('genericIdSearchTerm') === genericId &&
        params.get('recordIdSearchTerm') === recordId &&
        params.get('ssifSearchTerm') === '101'
      );
    });
  });
});


const selectComboboxOption = async (
  scope: Locator | Page,
  comboboxName: string,
  optionName: string,
  filterText = optionName,
) => {
  const combobox = scope.getByRole('combobox', {
    name: comboboxName,
    exact: true,
  });

  await combobox.click();
  const filter = scope
    .getByRole('textbox', { name: /Filtrera alternativ/i })
    .first();
  const hasVisibleFilter = await filter.isVisible().catch(() => false);

  if (hasVisibleFilter) {
    await filter.fill(filterText);
    await filter.press('Enter');
    await expect(combobox).toContainText(optionName);
    return;
  }

  await combobox.fill(filterText);
  await scope
    .getByRole('option', { name: optionName, exact: true })
    .first()
    .waitFor();
  await combobox.press('Enter');
};