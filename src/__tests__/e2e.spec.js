// @ts-check
import { test, expect } from '@playwright/test'
import axios from 'axios'

const PROJECTS = ['test']
const TASKS = ['testTask']

const pause = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

const deleteProject = async (name) => {
  const projects = await axios.get(
    `http://localhost:3000/projects?name=${name}`
  )
  if (!projects.data.length) return false
  const promises = projects.data.map((p) =>
    axios.delete(`http://localhost:3000/projects/${p.id}`)
  )
  await Promise.all(promises)
  return true
}

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/testboy')
})

test.beforeAll(async () => {
  await deleteProject(PROJECTS[0])
})

const addTestProject = async (page) => {
  await page.getByRole('link', { name: 'ÖVERSIKT' }).click()
  await page.getByRole('link', { name: 'PROJEKT' }).click()
  await page.getByRole('button', { name: 'Lägg till projekt' }).click()
  await page.getByPlaceholder('Project name').click()
  await page.getByPlaceholder('Project name').click()
  await page.getByPlaceholder('Project name').fill(PROJECTS[0])
  await page.getByTestId('#c6a0f6').click()
  await page.getByRole('button', { name: 'Spara' }).click()
}

const addTestTask = async (page) => {
  await page.getByRole('link', { name: 'ÖVERSIKT' }).click()
  await page.getByRole('link', { name: 'TASKS' }).click()
  await page.getByRole('button', { name: 'Lägg till task' }).click()
  await page.getByPlaceholder('Task namn').click()
  await page.getByPlaceholder('Task namn').fill(TASKS[0])
  await page.getByRole('combobox').selectOption({ label: PROJECTS[0] })
  await page.getByRole('button', { name: 'Spara' }).click()
}

const addTestTimer = async (page) => {
  await page.getByRole('link', { name: 'TIMER' }).click()
  await page.getByRole('link', { name: TASKS[0] }).click()
  await page.getByRole('button', { name: 'Starta' }).first().click()
  await pause(1000)
  await page.getByRole('button', { name: 'Stop' }).first().click()
}

const removeTestProject = async (page) => {
  await page.getByRole('link', { name: 'ÖVERSIKT' }).click()
  await page.getByRole('link', { name: 'PROJEKT' }).click()
  await page.getByRole('link', { name: PROJECTS[0] }).click()
  await page.getByRole('button', { name: 'Ta bort' }).click()
}

test.describe('Projects', () => {
  test('new project', async ({ page }) => {
    await deleteProject(PROJECTS[0])
    await page.getByRole('link', { name: 'ÖVERSIKT' }).click()
    await page.getByRole('link', { name: 'PROJEKT' }).click()
    await page.getByRole('button', { name: 'Lägg till projekt' }).click()
    await page.getByPlaceholder('Project name').click()
    await page.getByPlaceholder('Project name').click()
    await page.getByPlaceholder('Project name').fill(PROJECTS[0])
    await page.getByTestId('#c6a0f6').click()

    await expect(page.getByTestId('picked')).toHaveCSS(
      'background-color',
      'rgb(198, 160, 246)'
    )
    await expect(page.getByTestId('textPicked')).toHaveValue('#c6a0f6')
    await page.getByRole('button', { name: 'Spara' }).click()
    await expect(page.getByRole('heading', { name: PROJECTS[0] })).toBeVisible()
    await page.getByRole('link', { name: 'PROJEKT' }).click()
    await expect(
      page.getByRole('link', { name: PROJECTS[0] }).first()
    ).toBeVisible()
  })

  test('delete project', async ({ page }) => {
    await page.getByRole('link', { name: 'ÖVERSIKT' }).click()
    await page.getByRole('link', { name: 'PROJEKT' }).click()
    await page.getByRole('link', { name: PROJECTS[0], exact: true }).click()
    await page.getByRole('button', { name: 'Ta bort' }).click()
    await expect(
      page.getByRole('link', { name: PROJECTS[0], exact: true })
    ).not.toBeVisible()
  })
})

test.describe('Tasks', () => {
  test('new Task', async ({ page }) => {
    await addTestProject(page)

    await page.getByRole('link', { name: 'TASKS' }).click()
    await page.getByRole('button', { name: 'Lägg till task' }).click()
    await page.getByPlaceholder('Task namn').click()
    await page.getByPlaceholder('Task namn').fill(TASKS[0])
    await page.getByRole('combobox').selectOption({ label: PROJECTS[0] })
    await expect(page.locator('form div').nth(2)).toHaveCSS(
      'background-color',
      'rgb(198, 160, 246)'
    )
    await page.getByRole('button', { name: 'Spara' }).click()
    await expect(page.getByRole('heading', { name: TASKS[0] })).toBeVisible()
    await page.getByRole('link', { name: 'PROJEKT' }).click()
    await page.getByRole('link', { name: PROJECTS[0], exact: true }).click()
    await expect(
      page.getByRole('link', { name: TASKS[0], exact: true })
    ).toBeVisible()
  })

  test('delete Task', async ({ page }) => {
    await page.getByRole('link', { name: 'ÖVERSIKT' }).click()
    await page.getByRole('link', { name: 'TASKS' }).click()
    await page.getByRole('link', { name: TASKS[0], exact: true }).click()
    await page.getByRole('button', { name: 'Ta bort' }).click()
    await expect(
      page.getByRole('link', { name: TASKS[0], exact: true })
    ).not.toBeVisible()
  })
})

test.describe('Timers', () => {
  test('run timer for 3 seconds', async ({ page }) => {
    await addTestProject(page)
    await addTestTask(page)
    await page.getByRole('link', { name: 'TIMER' }).click()
    await page.getByRole('link', { name: TASKS[0], exact: true }).click()
    await page.getByRole('button', { name: 'Starta' }).first().click()
    await pause(3000)
    await page.getByRole('button', { name: 'Stop' }).first().click()
    await expect(page.getByText('00:00:03').first()).toBeVisible()
  })

  test('remove timer', async ({ page }) => {
    await page.getByRole('link', { name: 'TIMER' }).click()
    await page.getByRole('button', { name: 'Ta bort' }).first().click()
    await expect(
      page.getByRole('button', { name: 'Ta bort' })
    ).not.toBeVisible()
  })
})

test.describe('History', () => {
  test('should only show timers in time span', async ({ page }) => {
    await addTestTimer(page)
    await page.getByRole('link', { name: 'HISTORIK' }).click()
    await page.getByRole('textbox').first().click()
    await page.getByRole('textbox').first().fill('2022-12-16 00:00')
    await page.getByRole('textbox').first().press('Enter')
    await expect(
      page.getByRole('link', { name: 'testTask' }).first()
    ).toBeVisible()
    await page.getByRole('textbox').nth(1).click()
    await page.getByRole('textbox').nth(1).fill('2022-12-17 00:00')
    await expect(page.getByRole('link', { name: 'testTask' })).not.toBeVisible()
  })
})
