import { expect, test } from '@playwright/test'

const publicPages = ['/', '/services', '/about', '/contact', '/reservation']

test.beforeEach(async ({ page }) => {
  await page.route('**/api/cal/slots**', (route) => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ slotsByDate: {} }),
  }))
})

for (const pathname of publicPages) {
  test(`${pathname} renders without horizontal overflow`, async ({ page }) => {
    await page.goto(pathname)
    await expect(page.locator('h1')).toBeVisible()
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
    expect(overflow).toBe(false)
  })
}

test('contact journey is keyboard accessible and reports success', async ({ page }) => {
  await page.route('**/api/contact', (route) => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ success: true }),
  }))
  await page.goto('/contact')
  await page.getByLabel('Prénom').fill('Camille')
  await page.getByLabel('Nom', { exact: true }).fill('Durand')
  await page.getByLabel('Email').fill('camille@example.test')
  await page.getByLabel('Votre besoin').selectOption({ index: 1 })
  await page.getByLabel('Votre message').fill('Je souhaite préparer un trail.')
  const submit = page.getByRole('button', { name: 'Envoyer le message' })
  await submit.focus()
  await expect(submit).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Message envoyé' })).toBeVisible()
})

test('simplified editorial sections stay free of removed blocks', async ({ page }) => {
  await page.goto('/about')
  await expect(page.getByText('Une expérience forgée sur route comme en montagne.')).toBeVisible()
  await expect(page.getByText('On court ensemble ?')).toHaveCount(0)
  await expect(page.getByText('Approche', { exact: true })).toHaveCount(0)

  await page.goto('/contact')
  await expect(page.getByRole('heading', { name: 'Coordonnées' })).toHaveCount(0)

  await page.goto('/reservation')
  await expect(page.getByText('Échange découverte', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Point coaching en ligne', { exact: true })).toHaveCount(0)
})

test('commercial rules are consistent on the homepage and services page', async ({ page }) => {
  for (const pathname of ['/', '/services']) {
    await page.goto(pathname)

    await expect(
      page.getByRole('button', {
        name: 'Voir le coaching sur Nolio',
        exact: true,
      }),
    ).toBeVisible()
    await expect(page.getByText('À définir', { exact: true })).toHaveCount(2)
    await expect(page.locator('[href="/services#ebooks"]')).toHaveText('Voir les plans')
  }

  await page.goto('/services')
  await expect(page.locator('#ebooks').getByText('19€', { exact: true })).toHaveCount(4)
  const planLinks = page.locator('#ebooks li > a')
  const expectedDirection = (page.viewportSize()?.width ?? 0) < 640 ? 'column' : 'row'
  await expect(planLinks).toHaveCount(4)
  expect(
    await planLinks.evaluateAll((links) =>
      links.map((link) => getComputedStyle(link).flexDirection),
    ),
  ).toEqual(Array(4).fill(expectedDirection))
})

test('plan checkout button becomes available again after opening checkout', async ({ page }) => {
  await page.route('**/api/ebooks/checkout', (route) => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ url: 'about:blank#checkout' }),
  }))
  await page.goto('/plans/plan-10-km')

  await expect(page.getByText('Vous allez recevoir', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Prêt quand vous l’êtes', { exact: true })).toHaveCount(0)

  const popupPromise = page.waitForEvent('popup')
  const checkoutButton = page.getByRole('button', { name: 'Acheter le plan' })
  await checkoutButton.click()
  const popup = await popupPromise

  await expect(checkoutButton).toBeEnabled()
  await expect(checkoutButton).toHaveText('Acheter le plan')
  await popup.close()
})
