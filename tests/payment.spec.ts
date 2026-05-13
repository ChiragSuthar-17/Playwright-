import { test, expect } from '@playwright/test';

test.describe('Payment and Checkout Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Login
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    
    // Wait until inventory page loads
    await page.waitForURL('**/inventory.html');
    await page.waitForLoadState('networkidle');
  });

  // ─────────────────────────────────────────────
  // TC-001: Add item to cart
  // ─────────────────────────────────────────────
  test('TC-001: Add item to cart and verify cart count', async ({ page }) => {
    // ✅ Correct selector for SauceDemo add-to-cart button
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');
  });

  // ─────────────────────────────────────────────
  // TC-002: Complete checkout
  // ─────────────────────────────────────────────
  test('TC-002: Complete checkout with valid details', async ({ page }) => {
    // Add product
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    
    // Go to cart
    await page.click('.shopping_cart_link');
    await page.waitForURL('**/cart.html');
    
    // Checkout
    await page.click('[data-test="checkout"]');
    await page.waitForURL('**/checkout-step-one.html');
    
    // Fill shipping info
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    
    await page.click('[data-test="continue"]');
    await page.waitForURL('**/checkout-step-two.html');
    
    // Finish order
    await page.click('[data-test="finish"]');
    await page.waitForURL('**/checkout-complete.html');
    
    // Verify confirmation
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  // ─────────────────────────────────────────────
  // TC-003: Checkout fails with empty fields
  // ─────────────────────────────────────────────
  test('TC-003: Verify checkout fails with empty fields', async ({ page }) => {
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('.shopping_cart_link');
    await page.waitForURL('**/cart.html');
    
    await page.click('[data-test="checkout"]');
    await page.waitForURL('**/checkout-step-one.html');
    
    // Click continue without filling fields
    await page.click('[data-test="continue"]');
    
    // Expect error message
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toContainText('First Name is required');
  });

});