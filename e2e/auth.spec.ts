import { test, expect } from '@playwright/test'

test.describe('Autenticação', () => {
  test('redireciona para /login quando não autenticado', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/)
  })

  test('exibe página de login com logo e formulário', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('h1')).toContainText('NexIA Partners')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible()
  })

  test('exibe erro com credenciais inválidas', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'invalido@test.com')
    await page.fill('input[type="password"]', 'senhaerrada')
    await page.click('button[type="submit"]')
    // Deve mostrar toast de erro (sonner)
    await expect(page.locator('[data-sonner-toast]').first()).toBeVisible({ timeout: 5000 })
  })

  test('faz login com credenciais válidas', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'ana@nexialab.com.br')
    await page.fill('input[type="password"]', 'nexia@2026')
    await page.click('button[type="submit"]')
    // Deve redirecionar para o dashboard
    await expect(page).toHaveURL('/', { timeout: 15000 })
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 10000 })
  })
})
