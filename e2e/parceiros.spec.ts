import { test, expect } from '@playwright/test'

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'ana@nexialab.com.br')
  await page.fill('input[type="password"]', 'nexia@2026')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/', { timeout: 15000 })
}

test.describe('Parceiros', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await page.locator('aside').getByText('Parceiros').click()
    await expect(page).toHaveURL(/\/parceiros/)
  })

  test('exibe página de parceiros com botão de cadastro', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Parceiros')
    await expect(page.getByRole('button', { name: /novo parceiro/i })).toBeVisible()
  })

  test('abre dialog de cadastro de parceiro', async ({ page }) => {
    await page.click('button:has-text("Novo Parceiro")')
    await expect(page.locator('text=Cadastrar Parceiro')).toBeVisible()
    await expect(page.locator('input[placeholder="Nome do parceiro"]')).toBeVisible()
  })

  test('exibe cabeçalhos da tabela', async ({ page }) => {
    await expect(page.locator('th:has-text("Nome")')).toBeVisible()
    await expect(page.locator('th:has-text("Email")')).toBeVisible()
    await expect(page.locator('th:has-text("Empresa")')).toBeVisible()
    await expect(page.locator('th:has-text("Oportunidades")')).toBeVisible()
  })
})
