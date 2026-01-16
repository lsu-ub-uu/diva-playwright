import { test } from './util/fixtures';
import { expect } from '@playwright/test';
import { createUrl } from './util/createUrl';
import {
  getFirstDataAtomicValueWithNameInData,
  getFirstDataGroupWithNameInData,
} from './util/coraUtils';

test.describe('View output', () => {
  test('View report', async ({ page, divaOutput }) => {
    const recordTitle = getFirstDataAtomicValueWithNameInData(
      getFirstDataGroupWithNameInData(divaOutput, 'titleInfo'),
      'title',
    );
    const recordId = getFirstDataAtomicValueWithNameInData(
      getFirstDataGroupWithNameInData(divaOutput, 'recordInfo'),
      'id',
    );

    await page.goto(createUrl(`/diva-output/${recordId}`));

    // Title
    await expect(page.getByRole('heading', { level: 1 }), {
      message: 'Title',
    }).toHaveText(recordTitle);
  });
});
