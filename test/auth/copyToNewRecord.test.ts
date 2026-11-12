import { test } from '../util/fixtures';
import { createUrl } from '../util/createUrl';
import {
  getFirstDataAtomicValueWithNameInData,
  getFirstDataGroupWithNameInData,
} from '../util/coraUtils';
import { expect } from '@playwright/test';
import { getRecordIdFromUpdatePageUrl } from '../util/getRecordIdFromUpdatePageUrl';

test.describe('Copy to new record', () => {
  test('Output', async ({ request, page, divaOutput, authtoken }) => {
    const recordId = getFirstDataAtomicValueWithNameInData(
      getFirstDataGroupWithNameInData(divaOutput, 'recordInfo'),
      'id',
    );
    await page.goto(createUrl(`/diva-output/${recordId}`));

    await page.getByRole('button', { name: 'Copy to new record' }).click();

    const form = page.getByRole('main');

    // Title info
    await form.getByRole('button', { name: 'titleInfoLangGroupText' }).click();
    await form
      .getByRole('region', {
        name: 'titleInfoLangGroupText',
      })
      .getByRole('textbox', { name: 'titleTextVarText', exact: true })
      .fill('Changed title in copy');

    // Record info
    await form
      .getByRole('button', { name: 'recordInfoOutputUpdateGroupText' })
      .click();

    // Select visibility
    await form
      .getByRole('combobox', { name: 'visibilityCollectionVarText' })
      .selectOption({ label: 'publishedItemText' });

    // Submit
    await form
      .getByRole('button', { name: 'divaClient_SubmitButtonText' })
      .click();

    await expect(
      page.getByText('divaClient_recordSuccessfullyCreatedText'),
    ).toBeVisible();

    await expect(page.getByText('Changed title in copy')).toBeVisible();

    // Clean up created record
    const id = getRecordIdFromUpdatePageUrl(page);
    await request.delete(
      `${process.env.CORA_API_URL}/record/diva-output/${id}`,
      {
        headers: { Authtoken: authtoken },
      },
    );
  });
});
