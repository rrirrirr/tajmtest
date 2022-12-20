import { describe, expect, expectTypeOf, test } from 'vitest'
import { prettyDOM, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ListTitle from '../components/ListTitle'
import TimerComponent from '../components/TimerComponent'
import TimerInfo from '../components/TimerInfo'
import TimeDisplay from '../components/TimeDisplay'
import ColorPicker from '../components/ColorPicker'
import {
  BrowserRouter,
  createMemoryRouter,
  RouterProvider
} from 'react-router-dom'
import { timeString } from '../utils/utils'
import { combineArraysByKey } from '../utils/data'

describe('Timer', () => {
  const createDataRouter = (component, initial = '/') => {
    return createMemoryRouter(
      [
        {
          path: '/',
          element: component
        },
        {
          path: '/test/start',
          action: () => {
            return 'started'
          }
        },
        {
          path: '/test/stop',
          action: () => {
            return 'stopped'
          }
        }
      ],
      { initialEntries: [initial] }
    )
  }

  test('start button should be visible when not active', () => {
    const router = createDataRouter(
      <TimerComponent activeTimer={null} task={{ id: 'test' }} />
    )
    render(<RouterProvider router={router} />)
    expect(screen.getByText(/Starta/i)).toBeDefined()
  })

  test('start button should not be visible when active', () => {
    const router = createDataRouter(
      <TimerComponent
        activeTimer={{ elapsed: 10, id: 'test' }}
        task={{ id: 'test' }}
      />
    )

    render(<RouterProvider router={router} />)

    expectTypeOf(screen.queryByText(/Starta/i)).toBeUndefined()
  })

  test('stop button should not be visible when active', () => {
    const router = createDataRouter(
      <TimerComponent activeTimer={null} task={{ id: 'test' }} />
    )

    render(<RouterProvider router={router} />)

    expectTypeOf(screen.queryByText(/Stop/i)).toBeUndefined()
  })

  test('stop button should be visible when active', () => {
    const router = createDataRouter(
      <TimerComponent
        activeTimer={{ elapsed: 10, id: 'test' }}
        task={{ id: 'test' }}
      />
    )
    render(<RouterProvider router={router} />)

    expect(screen.getByText(/Stop/i)).toBeDefined()
  })

  test('start button with wrong path should show error', async () => {
    const user = userEvent.setup()
    const router = createDataRouter(
      <TimerComponent activeTimer={null} task={{ id: 'test' }} path="/test" />
    )

    render(<RouterProvider router={router} />)

    await user.click(screen.getByText(/Starta/i))
    expect(screen.getByText(/404/i)).toBeDefined()
  })

  test('start button should have the right action', async () => {
    const user = userEvent.setup()
    const router = createDataRouter(
      <TimerComponent activeTimer={null} task={{ id: 'test' }} />
    )

    render(<RouterProvider router={router} />)

    await user.click(screen.getByText(/Starta/i))
    const data = router.state.fetchers.entries().next().value[1].data
    expect(data).toBe('started')
  })

  test('start button should have the right action when using path prop', async () => {
    const user = userEvent.setup()
    const router = createDataRouter(
      <TimerComponent activeTimer={null} task={{ id: '' }} path="/test" />
    )

    render(<RouterProvider router={router} />)

    await user.click(screen.getByText(/Starta/i))
    const data = router.state.fetchers.entries().next().value[1].data
    expect(data).toBe('started')
  })

  test('stop button with wrong path should show error', async () => {
    const user = userEvent.setup()
    const router = createDataRouter(
      <TimerComponent
        activeTimer={{ elapsed: 10, id: 'test' }}
        task={{ id: 'test' }}
        path="/test"
      />
    )

    render(<RouterProvider router={router} />)

    await user.click(screen.getByText(/Stop/i))
    expect(screen.getByText(/404/i)).toBeDefined()
  })

  test('stop button should have the right action', async () => {
    const user = userEvent.setup()
    const router = createDataRouter(
      <TimerComponent
        activeTimer={{ elapsed: 10, id: 'test' }}
        task={{ id: 'test' }}
      />
    )

    render(<RouterProvider router={router} />)

    await user.click(screen.getByText(/Stop/i))
    const data = router.state.fetchers.entries().next().value[1].data
    expect(data).toBe('stopped')
  })

  test('stop button should have the right action when using path prop', async () => {
    const user = userEvent.setup()
    const router = createDataRouter(
      <TimerComponent
        activeTimer={{ elapsed: 10, id: '' }}
        task={{ id: '' }}
        path="/test"
      />
    )

    render(<RouterProvider router={router} />)

    await user.click(screen.getByText(/Stop/i))
    const data = router.state.fetchers.entries().next().value[1].data
    expect(data).toBe('stopped')
  })
})

describe('Titles in list', () => {
  test('should show title', () => {
    render(<ListTitle title="Testing" />, { wrapper: BrowserRouter })

    expect(screen.getByText(/Testing/i)).toBeDefined()
  })

  test('should have the correct link', async () => {
    const user = userEvent.setup()
    const link = '/test'
    const router = createMemoryRouter([
      { path: '/', element: <ListTitle title="Testing" link={link} /> },
      { path: link, element: <div /> }
    ])
    render(<RouterProvider router={router} />)

    await user.click(screen.getByText(/Testing/i))
    expect(router.state.location.pathname).toBe(link)
  })
})

describe('Calculate time spans correctly', () => {
  test('minutes should be correcty diplayed', () => {
    let time = timeString(456)
    let minutes = time.split(':')[1]
    expect(minutes).toBe('07')

    time = timeString(856)
    minutes = time.split(':')[1]
    expect(minutes).toBe('14')

    time = timeString(0)
    minutes = time.split(':')[1]
    expect(minutes).toBe('00')

    time = timeString(4444)
    minutes = time.split(':')[1]
    expect(minutes).toBe('14')
  })

  test('seconds should be correcty diplayed', () => {
    let time = timeString(456)
    let seconds = time.split(':')[2]
    expect(seconds).toBe('36')

    time = timeString(856)
    seconds = time.split(':')[2]
    expect(seconds).toBe('16')

    time = timeString(0)
    seconds = time.split(':')[2]
    expect(seconds).toBe('00')

    time = timeString(4444)
    seconds = time.split(':')[2]
    expect(seconds).toBe('04')
  })

  test('hours should be correcty diplayed', () => {
    let time = timeString(456)
    let hours = time.split(':')[0]
    expect(hours).toBe('00')

    time = timeString(4444)
    hours = time.split(':')[0]
    expect(hours).toBe('01')

    time = timeString(54444)
    hours = time.split(':')[0]
    expect(hours).toBe('15')

    time = timeString(854444)
    hours = time.split(':')[0]
    expect(hours).toBe('237')
  })
})

describe('Display time spans correctly', () => {
  test('seconds should be correcty diplayed', () => {
    const timer1 = {
      start: `2022-10-26T00:00:00.000Z`,
      end: '2022-10-26T00:00:07.000Z'
    }
    const timer2 = {
      start: `2022-10-26T00:00:00.000Z`,
      end: '2022-10-26T00:00:22.000Z'
    }
    const timer3 = {
      start: `2022-10-26T00:00:00.000Z`,
      end: '2022-10-26T00:00:00.000Z'
    }

    render(
      <div>
        <TimeDisplay timer={timer1} />
        <TimeDisplay timer={timer2} />
        <TimeDisplay timer={timer3} />
      </div>
    )
    expect(screen.getByText(/00:00:07/i)).toBeInTheDocument()
    expect(screen.getByText(/00:00:22/i)).toBeInTheDocument()
    expect(screen.getByText(/00:00:00/i)).toBeInTheDocument()
  })

  test('minutes should be correcty diplayed', () => {
    const timer1 = {
      start: `2022-10-26T00:00:00.000Z`,
      end: '2022-10-26T00:02:07.000Z'
    }
    const timer2 = {
      start: `2022-10-26T00:00:00.000Z`,
      end: '2022-10-26T00:33:00.000Z'
    }

    render(
      <div>
        <TimeDisplay timer={timer1} />
        <TimeDisplay timer={timer2} />
      </div>
    )
    expect(screen.getByText(/00:02:07/i)).toBeInTheDocument()
    expect(screen.getByText(/00:33:00/i)).toBeInTheDocument()
  })
  test('hours should be correcty diplayed', () => {
    const timer1 = {
      start: `2022-10-26T00:00:00.000Z`,
      end: '2022-10-26T01:02:07.000Z'
    }
    const timer2 = {
      start: `2022-10-26T00:00:00.000Z`,
      end: '2022-10-26T22:33:00.000Z'
    }
    const timer3 = {
      start: `2022-10-26T00:00:00.000Z`,
      end: '2022-10-27T05:33:00.000Z'
    }

    render(
      <div>
        <TimeDisplay timer={timer1} />
        <TimeDisplay timer={timer2} />
        <TimeDisplay timer={timer3} />
      </div>
    )
    expect(screen.getByText(/01:02:07/i)).toBeInTheDocument()
    expect(screen.getByText(/22:33:00/i)).toBeInTheDocument()
    expect(screen.getByText(/29:33:00/i)).toBeInTheDocument()
  })
})

describe('Combine arrays by keys', () => {
  const base = [{ 1: '1', 2: '2', 3: '3', combine: 'test' }]
  const combineWith = [
    { 4: '4', 5: '5', 6: '6', c: 'test' },
    { 4: '4', 5: '5', 6: '6', c: 'no' }
  ]
  test('simple combine with all props in base', () => {
    const array = combineArraysByKey([
      { array: base, key: 'combine', props: 'all' },
      {
        array: combineWith,
        key: 'c',
        props: { 4: '4t', 5: '5t' }
      }
    ])
    expect(array).toStrictEqual([
      {
        1: '1',
        2: '2',
        3: '3',
        combine: 'test',
        '4t': '4',
        '5t': '5'
      }
    ])
  })
})

describe('Color picker', () => {
  const testColors = ['#111111', '#222222', '#333333', '#444444', '#555555']

  test('should render color buttons', async () => {
    render(<ColorPicker colors={testColors} startColor="#000000" />)

    const colorButtons = screen.getAllByRole('button')
    expect(colorButtons[4]).toBeInTheDocument()
  })

  test('Pick color button changes color in box', async () => {
    const user = userEvent.setup()
    render(<ColorPicker colors={testColors} startColor="#000000" />)

    await user.click(screen.getByTestId('#111111'))
    expect(screen.getByTestId('picked')).toHaveStyle(
      'background-color: rgb(17, 17, 17)'
    )
  })

  test('Pick color button changes color in text field', async () => {
    const user = userEvent.setup()
    render(<ColorPicker colors={testColors} starColor="#000000" />)

    await user.click(screen.getByTestId('#111111'))
    expect(screen.getByLabelText('Project color')).toHaveValue('#111111')
  })

  test('Input field changes colox in box', async () => {
    const user = userEvent.setup()
    render(<ColorPicker colors={testColors} starColor="#000000" />)

    await user.type(screen.getByLabelText('Project color'), '#111111')
    expect(screen.getByTestId('picked')).toHaveStyle(
      'background-color: rgb(17, 17, 17)'
    )
  })

  test('Start color prop changes color in box', async () => {
    render(<ColorPicker colors={testColors} startColor="#000000" />)

    expect(screen.getByTestId('picked')).toHaveStyle(
      'background-color: rgb(0,	0, 0)'
    )
  })

  test('Start color prop changes color in text field', async () => {
    render(<ColorPicker colors={testColors} startColor="#000000" />)
    expect(screen.getByLabelText('Project color')).toHaveValue('#000000')
  })
})

describe('Timer info in task overview', () => {
  const task = {
    title: 'testTask',
    id: 'testId'
  }
  const timer = {
    start: '2022-10-26T15:09:10.447Z',
    end: '2022-10-26T15:09:22.052Z',
    id: '2'
  }
  const project = {
    name: 'testProject',
    id: 'testId'
  }

  test('should show project name', () => {
    render(<TimerInfo task={task} timer={timer} project={project} />, {
      wrapper: BrowserRouter
    })

    expect(screen.getByText(/testProject/i)).toBeInTheDocument()
  })

  test('should show correct date', () => {
    render(<TimerInfo task={task} timer={timer} project={project} />, {
      wrapper: BrowserRouter
    })

    expect(screen.getByText(/Wed Oct 26 2022/i)).toBeInTheDocument()
  })

  test('should have the correct timer link', async () => {
    const user = userEvent.setup()
    const link = `/timers/${task.id}`
    const router = createMemoryRouter(
      [
        {
          path: '/overview/tasks/id',
          element: <TimerInfo task={task} timer={timer} project={project} />
        },
        { path: link, element: <div /> }
      ],
      { initialEntries: ['/', '/overview/tasks/id'] }
    )
    render(<RouterProvider router={router} />)
    await user.click(screen.getByText(/Wed Oct 26 2022/i))
    expect(router.state.location.pathname).toBe(link)
  })

  test('should have the correct project link', async () => {
    const user = userEvent.setup()
    const link = `/projects/${project.id}`
    const router = createMemoryRouter(
      [
        {
          path: '/overview/tasks/id',
          element: <TimerInfo task={task} timer={timer} project={project} />
        },
        { path: link, element: <div /> }
      ],
      { initialEntries: ['/', '/overview/tasks/id'] }
    )
    render(<RouterProvider router={router} />)
    await user.click(screen.getByText(/testProject/i))
    expect(router.state.location.pathname).toBe(link)
  })
})
