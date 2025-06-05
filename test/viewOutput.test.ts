import { test } from "./util/fixtures";
import { expect } from "@playwright/test";
import { createUrl } from "./util/createUrl";
import {
  getFirstDataAtomicValueWithNameInData,
  getFirstDataGroupWithNameInData,
} from "./util/coraUtils";

test.describe("View output", () => {
  test("View report", async ({ page, divaOutput }) => {
    const recordId = getFirstDataAtomicValueWithNameInData(
      getFirstDataGroupWithNameInData(divaOutput, "recordInfo"),
      "id"
    );
    const recordTitle = getFirstDataAtomicValueWithNameInData(
      getFirstDataGroupWithNameInData(divaOutput, "titleInfo"),
      "title"
    );

    await page.goto(createUrl(`/diva-output/${recordId}`));

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      recordTitle
    );

    await expect(page.getByText("Rapport")).toBeVisible();

    expect(page.getByText("Ainu")).toBeVisible();

    expect(page.getByText("Övrigt vetenskapligt/konstnärligt")).toBeVisible();

    expect(page.getByText("2025")).toBeVisible();

    expect(page.getByText(recordId)).toBeVisible();
  });
});
