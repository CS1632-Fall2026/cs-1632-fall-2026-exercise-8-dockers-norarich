import { test, expect } from '@playwright/test';



test.beforeEach(async ({ page, context }) => {
    // Open the website
    await page.goto('http://localhost:8080/');

    // Set cookies so no cats are rented
    await page.evaluate(() => {
        document.cookie = "1=false";
        document.cookie = "2=false";
        document.cookie = "3=false";
      });

    // Reload so the application reads the new cookie values
    await page.reload();
});


// TODO: Fill in with test cases.
test('TEST-1-RESET', async ({ page }) => {

    await page.evaluate(() => {
        document.cookie = '1=true';
        document.cookie = '2=true';
        document.cookie = '3=true';
    });
    await page.reload();

    await page.getByRole("link", {name: 'Reset'}).click();

  
    const cats = page.getByRole('list', { name: 'Cat names' });
    const firstCat = cats.getByRole('listitem').nth(0);
    const secondCat = cats.getByRole('listitem').nth(1);
    const thirdCat = cats.getByRole('listitem').nth(2);

    await expect(firstCat).toHaveText('ID 1. Jennyanydots');
    await expect(secondCat).toHaveText('ID 2. Old Deuteronomy');
    await expect(thirdCat).toHaveText('ID 3. Mistoffelees');
});

test('TEST-2-CATALOG', async ({ page }) => {
    await page.reload();

    await page.getByRole("link", {name: 'Catalog'}).click();

  
    const cats = page.getByRole('list', { name: 'Cat photos' });
    const secondItem = cats.getByRole('listitem').nth(1);
    const secondImage = secondItem.getByRole('img');
    
    await expect(secondImage).toHaveAttribute('src', '/images/cat2.jpg');
});

test('TEST-3-LISTING', async ({ page }) => {
    await page.getByRole("link", {name: 'Catalog'}).click();

  
    const cats = page.getByRole('list', { name: 'Cat names' });
    const catItems = cats.getByRole('listitem');
    const thirdCat = cats.getByRole('listitem').nth(2);

    await expect(catItems).toHaveCount(3);
    await expect(thirdCat).toHaveText('ID 3. Mistoffelees');
});

test('TEST-4-RENT-A-CAT', async ({ page }) => {
    await page.getByRole("link", {name: 'Rent-A-Cat'}).click();

    
    await expect(page.getByRole("button", {name: 'Rent'})).toBeVisible();
    await expect(page.getByRole("button", {name: 'Return'})).toBeVisible();
});

test('TEST-5-RENT', async ({ page }) => {
    await page.getByRole("link", {name: 'Rent-A-Cat'}).click();
    await page.getByRole("textbox", {name: 'Enter the ID of the cat to rent:'}).fill("1");
    await page.getByRole("button", {name: 'Rent'}).click();
    
    const cats = page.getByRole('list', { name: 'Cat names' });
    const firstCat = cats.getByRole('listitem').nth(0);
    const secondCat = cats.getByRole('listitem').nth(1);
    const thirdCat = cats.getByRole('listitem').nth(2);

    await expect(firstCat).toHaveText('Rented out');
    await expect(secondCat).toHaveText('ID 2. Old Deuteronomy');
    await expect(thirdCat).toHaveText('ID 3. Mistoffelees');
    await expect(page.getByText("Success!")).toBeVisible();
});

test('TEST-6-RETURN', async ({ page }) => {
    await page.evaluate(() => {
        document.cookie = '2=true';
        document.cookie = '3=true';
    });
    await page.reload();

    await page.getByRole("link", {name: 'Rent-A-Cat'}).click();
    await page.getByRole("textbox", {name: 'Enter the ID of the cat to return:'}).fill("2");
    await page.getByRole("button", {name: 'Return'}).click();
    
    const cats = page.getByRole('list', { name: 'Cat names' });
    const firstCat = cats.getByRole('listitem').nth(0);
    const secondCat = cats.getByRole('listitem').nth(1);
    const thirdCat = cats.getByRole('listitem').nth(2);

    await expect(firstCat).toHaveText('ID 1. Jennyanydots');
    await expect(secondCat).toHaveText('ID 2. Old Deuteronomy');
    await expect(thirdCat).toHaveText('Rented out');
    await expect(page.getByText("Success!")).toBeVisible();
});

test('TEST-7-FEED-A-CAT', async ({ page }) => {
    await page.getByRole("link", {name: 'Feed-A-Cat'}).click();
    await expect(page.getByRole("button", {name: "Feed"})).toBeVisible();
});

test('TEST-8-FEED', async ({ page }) => {
    await page.getByRole("link", {name: 'Feed-A-Cat'}).click();
    await page.getByRole("textbox", {name: 'Number of catnips to feed:'}).fill("6");
    await page.getByRole("button", {name: 'Feed'}).click();

    await expect(page.getByText("Nom, nom, nom.")).toBeVisible({ timeout: 10000 });
});

test('TEST-9-GREET-A-CAT', async ({ page }) => {
    await page.getByRole("link", {name: 'Greet-A-Cat'}).click();
  
    await expect(page.getByText("Meow!Meow!Meow!")).toBeVisible();
});

test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {
    await page.goto('http://localhost:8080/Jennyanydots');

    await expect(page.getByText("Meow! from Jennyanydots.")).toBeVisible();
});

test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ page }) => {
     await page.evaluate(() => {
        document.cookie = '1=true';
        document.cookie = '2=true';
        document.cookie = '3=true';
    });
    await page.reload();

    await page.getByRole("link", {name: 'Feed-A-Cat'}).click();
    await expect(page.locator("body")).toHaveScreenshot()
});