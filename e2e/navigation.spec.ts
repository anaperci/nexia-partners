import { test, expect } from '@playwright/test'

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'ana@nexialab.com.br')
  await page.fill('input[type="password"]', 'nexia@2026')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/', { timeout: 15000 })
}

test.describe('Navegação', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('dashboard exibe métricas', async ({ page }) => {
    await expect(page.locator('text=Dashboard').first()).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Total').first()).toBeVisible()
  })

  test('navega para oportunidades via sidebar', async ({ page }) => {
    await page.locator('aside').getByText('Oportunidades').click()
    await expect(page).toHaveURL(/\/oportunidades/)
  })

  test('navega para parceiros via sidebar', async ({ page }) => {
    await page.locator('aside').getByText('Parceiros').click()
    await expect(page).toHaveURL(/\/parceiros/)
  })

  test('navega para relatórios via sidebar', async ({ page }) => {
    await page.locator('aside').getByText('Relatórios').click()
    await expect(page).toHaveURL(/\/relatorios/)
  })

  test('navega para configurações via sidebar', async ({ page }) => {
    await page.locator('aside').getByText('Configurações').click()
    await expect(page).toHaveURL(/\/configuracoes/)
  })

  test('submenu expande ao clicar em oportunidades', async ({ page }) => {
    await page.locator('aside').getByText('Oportunidades').click()
    await expect(page.locator('aside').getByText('Nova oportunidade')).toBeVisible()
  })

  test('navega para nova oportunidade via submenu', async ({ page }) => {
    await page.locator('aside').getByText('Oportunidades').click()
    await page.locator('aside').getByText('Nova oportunidade').click()
    await expect(page).toHaveURL(/\/oportunidades\/nova/)
  })
})
