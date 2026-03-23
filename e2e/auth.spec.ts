import { test, expect } from '@playwright/test'

test.describe('Autenticação', () => {
  test('redireciona para /login quando não autenticado', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/)
  })

  test('exibe página de login com logo e formulário', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('text=NexIA Partners')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible()
  })

  test('exibe erro com credenciais inválidas', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'invalido@test.com')
    await page.fill('input[type="password"]', 'senhaerrada')
    await page.click('button[type="submit"]')
    await expect(page.locator('[data-sonner-toast]').first()).toBeVisible({ timeout: 5000 })
  })

  test('faz login com credenciais válidas', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'ana@nexialab.com.br')
    await page.fill('input[type="password"]', 'nexia@2026')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/', { timeout: 15000 })
    // Sidebar deve estar visível com Dashboard
    await expect(page.locator('aside')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Dashboard').first()).toBeVisible()
  })
})
