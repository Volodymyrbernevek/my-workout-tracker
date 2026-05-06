import { test, expect } from '@playwright/test'

const APP_URL = 'http://localhost:5173'

test.describe('Workout Tracker E2E Сценарії', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL)
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('Користувач може успішно додати нову вправу до плану', async ({ page }) => {
   
    const addBtn = page.locator('.main-add-btn')
    await expect(addBtn).toBeVisible()
    await addBtn.click()

    await page.locator('select').selectOption('Силові')
    await page.locator('input[placeholder="Наприклад: Присідання"]').fill('Присідання зі штангою')
    
    await page.locator('input[type="number"]').first().fill('80')
    await page.locator('input[type="number"]').last().fill('10')

    await page.locator('.add-plan-btn').click()

    const planCard = page.locator('.plan-card')
    await expect(planCard).toBeVisible()
    await expect(planCard).toContainText('Присідання зі штангою')
    await expect(planCard).toContainText('80кг x 10')
  })

  test('Користувач може виконати вправу і вона переходить до історії', async ({ page }) => {
    
    await page.locator('.main-add-btn').click()
    await page.locator('select').selectOption('Кардіо')
    await page.locator('input[placeholder="Наприклад: Присідання"]').fill('Ранковий біг')
    
    await page.locator('input[type="number"]').first().fill('5')
    await page.locator('input[type="number"]').last().fill('30')
    await page.locator('.add-plan-btn').click()

    await expect(page.locator('.plan-card')).toBeVisible()

    await page.locator('.mini-done-btn').click()

    await expect(page.locator('.plan-card')).not.toBeVisible()
    await expect(page.locator('.plan-section .empty')).toContainText('План порожній.')

    const historyCard = page.locator('.history-card')
    await expect(historyCard).toBeVisible()
    await expect(historyCard).toContainText('Ранковий біг')
    await expect(historyCard).toContainText('5км / 30хв')
  })
})