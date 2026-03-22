import { test, expect } from '@playwright/test'

// Helper para fazer login antes dos testes de navegação
async function login(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'ana@nexialab.com.br')
  await page.fill('input[type="password"]', 'nexia@2026')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/', { timeout: 10000 })
}

test.describe('Navegação', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('dashboard exibe métricas e tabela', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Total').first()).toBeVisible()
    await expect(page.locator('text=Oportunidades Recentes')).toBeVisible()
  })

  test('navega para oportunidades', async ({ page }) => {
    await page.click('a:has-text("Oportunidades")')
    await expect(page).toHaveURL(/\/oportunidades/)
    await expect(page.locator('h1')).toContainText('Oportunidades')
  })

  test('navega para parceiros', async ({ page }) => {
    await page.click('a:has-text("Parceiros")')
    await expect(page).toHaveURL(/\/parceiros/)
    await expect(page.locator('h1')).toContainText('Parceiros')
  })

  test('navega para relatórios', async ({ page }) => {
    await page.click('a:has-text("Relatórios")')
    await expect(page).toHaveURL(/\/relatorios/)
    await expect(page.locator('h1')).toContainText('Relatórios')
  })

  test('navega para configurações', async ({ page }) => {
    await page.click('a:has-text("Configurações")')
    await expect(page).toHaveURL(/\/configuracoes/)
    await expect(page.locator('h1')).toContainText('Configurações')
  })

  test('subbarra aparece em oportunidades', async ({ page }) => {
    await page.click('a:has-text("Oportunidades")')
    await expect(page.locator('text=Listar todas')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Nova oportunidade', exact: true })).toBeVisible()
  })

  test('navega para nova oportunidade via subbarra', async ({ page }) => {
    await page.click('a:has-text("Oportunidades")')
    await page.click('a:has-text("Nova oportunidade")')
    await expect(page).toHaveURL(/\/oportunidades\/nova/)
  })
})
