import { beforeEach, describe, expect, expectTypeOf, test, vi } from 'vitest'
import {
  prettyDOM,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  getByText,
  fireEvent
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import {
  BrowserRouter,
  createMemoryRouter,
  RouterProvider,
  Outlet
} from 'react-router-dom'
import { ProjectsProvider } from '../contexts/projectsContext'
import { TasksProvider } from '../contexts/tasksContext'
import { TimersProvider } from '../contexts/timersContext'

import Project, { loader as projectLoader } from '../routes/project'
import Projects, { action as projectAction } from '../routes/projects'
import { action as deleteProjectAction } from '../routes/deleteProject'

import Task, { loader as taskLoader } from '../routes/task'
import Tasks, {
  loader as tasksLoader,
  action as taskAction
} from '../routes/tasks'
import { action as deleteTaskAction } from '../routes/deleteTask'

import User, { loader as userLoader } from '../routes/user'
import Timers from '../routes/timers'
import Timer, { loader as timerLoader } from '../routes/timer'
import {
  startTaskTimerAction,
  stopTaskTimerAction,
  deleteTaskTimerAction
} from '../routes/taskTimer'

import { rest } from 'msw'
import { setupServer } from 'msw/node'
import * as predata from './data'
import ContextSetup, { loader as testLoader } from './ContextSetup'

let data = predata.default

const handlers = [
  rest.get('http://localhost:3000/test', (req, res, ctx) => {
    return res(ctx.json(data))
  }),
  rest.get('http://localhost:3000/timelogs', (req, res, ctx) => {
    return res(ctx.json(data.timelogs))
  }),
  rest.get('http://localhost:3000/timelogs/:id', (req, res, ctx) => {
    const { timerId } = req.params
    return res(ctx.json(data.timelogs))
  }),
  rest.delete('http://localhost:3000/timelogs/:timerId', (req, res, ctx) => {
    const { timerId } = req.params
    data.timelogs = data.timelogs.filter((t) => t.id !== timerId)
    return res(ctx.json(data.timelogs))
  }),
  rest.get('http://localhost:3000/users', (req, res, ctx) => {
    return res(ctx.json(data.users))
  }),
  rest.get('http://localhost:3000/users/:id', (req, res, ctx) => {
    return res(ctx.json(data.users))
  }),
  rest.get('http://localhost:3000/projects', (req, res, ctx) => {
    return res(ctx.json(data.projects))
  }),
  rest.get('http://localhost:3000/projects/:id', (req, res, ctx) => {
    const { id } = req.params
    return res(ctx.json(data.projects.find((p) => p.id === id)))
  }),
  rest.delete('http://localhost:3000/projects/:id', (req, res, ctx) => {
    const { id } = req.params
    data.projects = data.projects.filter((p) => p.id !== id)
    return res(ctx.json(data.projects))
  }),
  rest.get('http://localhost:3000/tasks', (req, res, ctx) => {
    return res(ctx.json(data.tasks))
  }),
  rest.get('http://localhost:3000/tasks/:id', (req, res, ctx) => {
    const { id } = req.params
    return res(ctx.json(data.tasks.find((t) => t.id === id)))
  }),
  rest.delete('http://localhost:3000/tasks/:id', (req, res, ctx) => {
    const { id } = req.params
    data.tasks = data.tasks.filter((t) => t.id !== id)
    return res(ctx.json(data.tasks))
  })
]

const server = setupServer(...handlers)

const createDataRouter = (initial) => {
  return createMemoryRouter(
    [
      {
        path: '/',
        // element: <ContextSetup user="admin" />,
        element: <Outlet />,
        children: [
          {
            path: ':user',
            element: <User />,
            loader: userLoader,
            children: [
              {
                path: 'overview',
                children: [
                  {
                    path: 'tasks',
                    element: <Tasks />
                  },
                  {
                    path: 'tasks/:taskId',
                    element: <Task />,
                    loader: taskLoader
                  },
                  {
                    path: 'tasks/:taskId/destroy',
                    action: deleteTaskAction
                  },
                  {
                    path: 'projects',
                    element: <Projects />,
                    action: projectAction
                  },
                  {
                    path: 'projects/:projectId',
                    element: <Project />,
                    loader: projectLoader
                  },
                  {
                    path: 'projects/:projectId/destroy',
                    action: deleteProjectAction
                  }
                ]
              },

              {
                path: 'timers',
                element: <Timers />,
                children: [
                  {
                    path: ':taskId',
                    loader: timerLoader,
                    element: <Timer />
                  },
                  {
                    path: ':taskId/start',
                    action: startTaskTimerAction
                  },
                  {
                    path: ':timerId/stop',
                    action: stopTaskTimerAction
                  },
                  {
                    path: ':timerId/destroy',
                    action: deleteTaskTimerAction
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    { initialEntries: ['/', initial] }
  )
}

const createRouterWrappedInContexts = (path) => {
  const router = createDataRouter(path)

  return (
    <TasksProvider>
      <ProjectsProvider>
        <TimersProvider>
          <RouterProvider router={router} />
        </TimersProvider>
      </ProjectsProvider>
    </TasksProvider>
  )
}

window.ResizeObserver =
  window.ResizeObserver ||
  vi.fn().mockImplementation(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    unobserve: vi.fn()
  }))

beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    value: vi.fn()
  })
  data = { ...predata.default }
})
beforeAll(() => server.listen())
afterAll(() => server.close())

describe('Timers', () => {
  // const mock = vi.fn().mockImplementation(getLatest)

  test('render dates with only latest timer for each task', async () => {
    render(createRouterWrappedInContexts('/admin/timers'))

    await waitFor(() => screen.getByText(/Oct 28/i))
    expect(screen.getByText(/Oct 28/i)).toBeDefined()
    expect(screen.getByText(/Oct 26/i)).toBeDefined()
  })

  test('render task titles', async () => {
    render(createRouterWrappedInContexts('/admin/timers'))

    await waitFor(() => screen.getByText(/task12/i))
    expect(screen.getByText(/task12/i)).toBeDefined()
    expect(screen.getByText(/task2/i)).toBeDefined()
    expect(screen.getByText(/new/i)).toBeDefined()
  })

  test('render tasks with no time logs in "Övriga"', async () => {
    render(createRouterWrappedInContexts('/admin/timers'))

    await waitFor(() => {
      expect(screen.getByText(/Övriga/i)).toBeDefined()
    })
  })

  test('clicking a timer title should load the timer', async () => {
    const user = userEvent.setup()
    render(createRouterWrappedInContexts('/admin/timers'))

    await waitFor(async () => screen.getByText(/task2/i))
    await user.click(screen.getByText(/task2/i))
    await waitFor(async () => {
      expect(screen.getAllByText(/Starta/i)).toBeDefined()
    })
  })

  test('removing a timer should remove date', async () => {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 300
    })
    const user = userEvent.setup()
    render(createRouterWrappedInContexts('/admin/timers'))

    await waitFor(() => screen.getAllByText(/Ta bort/i))
    expect(screen.getByText(/28 2022/i)).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: /Ta bort/i })[0])
    await waitForElementToBeRemoved(() => screen.getByText(/28 2022/i))
    expect(screen.queryByText(/28 2022/i)).not.toBeInTheDocument()
  })

  test('removing a timer should move task to "Övriga"', async () => {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 300
    })
    const user = userEvent.setup()
    render(createRouterWrappedInContexts('/admin/timers'))

    await waitFor(() => screen.getAllByText(/Ta bort/i))
    expect(screen.getByText(/28 2022/i)).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: /Ta bort/i })[0])
    await waitForElementToBeRemoved(() => screen.getByText(/28 2022/i))
    let container = screen.getByText(/Övriga/i).parentElement.parentElement
    expect(getByText(container, /task12/i)).toBeInTheDocument()
  })
})

describe('Tasks', () => {
  test('should render task title', async () => {
    render(createRouterWrappedInContexts('/admin/overview/tasks/fqY0I05'))

    await waitFor(() => screen.getByText(/task12/i))
    expect(screen.getByText(/task12/i)).toBeInTheDocument()
  })

  test('should render timers', async () => {
    render(createRouterWrappedInContexts('/admin/overview/tasks/VItk0ZE'))
    await waitFor(() => screen.getByText(/Wed Oct 26 2022/i))
    expect(screen.getByText(/Wed Oct 26 2022/i)).toBeInTheDocument()
    expect(screen.getByText(/Sat Sep 24 2022/i)).toBeInTheDocument()
  })

  // test('should render project name inside timers', async () => {
  //   Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
  //     configurable: true,
  //     value: 100
  //   })
  //   const user = userEvent.setup()
  //   render(createRouterWrappedInContexts('/admin/overview/tasks/flICbPN'))

  //   await waitFor(() => screen.getByText(/Fri Oct 28 2022/i))
  //   const container =
  //     screen.getByText(/Fri Oct 28 2022/i).parentElement.parentElement
  //       .parentElement.parentElement
  //   fireEvent.scroll(container, { target: { scrollX: 200 } })
  //   expect(screen.getByText(/proj 1/i)).toBeInTheDocument()
  // })

  test('removing a timer should remove it from tasks overview', async () => {
    const user = userEvent.setup()
    render(createRouterWrappedInContexts('/admin/overview/tasks/fqY0I05'))

    await waitFor(() => screen.getAllByText(/task12/i))
    await user.click(screen.getByRole('button', { name: /Ta bort/i }))
    await waitFor(() => screen.getAllByText(/new/i))
    await waitForElementToBeRemoved(() => screen.getByText(/task12/i))
    expect(screen.queryByText(/task12/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/new/i)).toBeInTheDocument()
  })
})

describe('Projects', () => {
  test("should render project's title", async () => {
    render(createRouterWrappedInContexts('/admin/overview/projects/alICPN'))

    await waitFor(() => screen.getByText(/proj 1/i))
    expect(screen.getByText(/proj 1/i)).toBeInTheDocument()
  })

  test('should render tasks', async () => {
    render(createRouterWrappedInContexts('/admin/overview/projects/alICPN'))
    await waitFor(() => screen.getByText(/task12/i))
    expect(screen.getByText(/task12/i)).toBeInTheDocument()
    expect(screen.getByText(/task2/i)).toBeInTheDocument()
    expect(screen.getByText(/new/i)).toBeInTheDocument()
  })

  test('removing a project should remove it from projects overview', async () => {
    const user = userEvent.setup()
    render(createRouterWrappedInContexts('/admin/overview/projects/alICPN'))

    await waitFor(() => screen.getAllByText(/proj 1/i))
    await user.click(screen.getByRole('button', { name: /Ta bort/i }))
    await waitFor(() =>
      screen.getByRole('button', { name: /Lägg till projekt/i })
    )
    await waitForElementToBeRemoved(() => screen.getByText(/proj 1/i))
    expect(screen.queryByText(/proj 1/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Inga projekt/i)).toBeInTheDocument()
  })
})
