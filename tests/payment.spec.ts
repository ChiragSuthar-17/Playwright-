import { test, expect } from '@playwright/test';

test.describe('Payment and Checkout Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Go to the sample site before each test
    await page.goto('https://www.saucedemo.com');
    // Login
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
  });

  test('TC-001: Add item to cart and verify cart count', async ({ page }) => {
    // Add first product
    await page.click('.btn_primary:first-child');
    // Check cart badge
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');
  });

  test('TC-002: Complete checkout with valid details', async ({ page }) => {
    // Add product
    await page.click('.btn_primary:first-child');
    // Go to cart
    await page.click('.shopping_cart_link');
    // Checkout
    await page.click('#checkout');
    // Fill shipping info
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');
    await page.click('#continue');
    // Complete order
    await page.click('#finish');
    // Verify confirmation
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('TC-003: Verify checkout fails with empty fields', async ({ page }) => {
    await page.click('.btn_primary:first-child');
    await page.click('.shopping_cart_link');
    await page.click('#checkout');
    // Skip filling fields — click continue directly
    await page.click('#continue');
    // Expect error
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
  });

});
