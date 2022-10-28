import { useFetcher, Outlet, Link } from 'react-router-dom'
import { useTasksContext } from '../contexts/tasksContext'
import { useTimersContext } from '../contexts/timersContext'
import { useProjectsContext } from '../contexts/projectsContext'
import { combineArraysByKey } from '../utils/data'
import { totalTime, timeString } from '../utils/utils'
import { useEffect, useState } from 'react'
import List from '../components/List'
import ListContent from '../components/ListContent'
import styles from './Timers.module.css'

export async function loader({params}) {
  return params.taskId
}

export default function Timers() {
  const { tasks } = useTasksContext()
  const { projects } = useProjectsContext()
  const {
    timers,
    activeTimers,
    getLatestTimer,
    getActiveTimerIndex,
    stopTimer
  } = useTimersContext()
  const [tasksWithAllInfo, setTasksWithAllInfo] = useState()

  const [dates, setDates] = useState(new Map())
  const [sortedDates, setSortedDates] = useState([])
  const [activeTimersUpdate, setActiveTimersUpdate] = useState(0)

  const fetcher = useFetcher()

  useEffect(() => {
    if (fetcher.formData) {
      const stopTimer = fetcher.formData.get('stop')
      const startTimer = fetcher.formData.get('start')
      // if (stopTimer) handleStop(stopTimer) 				//fix optimistic ui
      if (startTimer) handleStart(startTimer) //fix optimistic ui
    }
  }, [fetcher.formData])

  // prepare data after it loaded
  useEffect(() => {
    if (tasks.length && timers && projects.length) {
      const combinedTasksAndProjects = combineArraysByKey([
        { array: tasks, key: 'projectId', props: 'all' },
        {
          array: projects,
          key: 'id',
          props: { color: 'color', name: 'projectName' }
        }
      ])
      const combinedData = combineArraysByKey([
        { array: combinedTasksAndProjects, key: 'id', props: 'all' },
        {
          array: timers,
          key: 'taskId',
          props: 'all',
          all: 'timers'
        }
      ])
      setTasksWithAllInfo(
        combinedData.map((task) => {
          return {
            ...task,
            latest: getLatestTimer(task.id),
            // latest: task.timers.at(-1) || false,
            activeTimerIndex: -1
          }
        })
      )
    }
  }, [tasks, timers, projects])

  // prepare active timers
  useEffect(() => {
    if (activeTimers.length !== activeTimersUpdate && tasksWithAllInfo) {
      setActiveTimersUpdate(activeTimers.length)
      setTasksWithAllInfo(
        tasksWithAllInfo.map((task) => {
          return {
            ...task,
            activeTimerIndex: getActiveTimerIndex(task.id)
          }
        })
      )
    }
  }, [activeTimers])

  // add timers to Map with dates as keys and save all dates when timers were active
  useEffect(() => {
    if (tasksWithAllInfo?.length) {
      const dateMap = new Map()
      tasksWithAllInfo.forEach((task) => {
        const date = !task.latest
          ? 'no'
          : task.latest.end.length
          ? new Date(task.latest.end)
          : new Date()
        const dateStr = date !== 'no' ? date.toDateString() : date
        if (!dateMap.has(dateStr)) {
          dateMap.set(dateStr, [])
        }
        dateMap.get(dateStr).push(task)
      })
      setSortedDates(
        [...dateMap.keys()].sort((a, b) => {
          if (a === 'no') return 1
          if (b === 'no') return -1
          const ad = new Date(a)
          const bd = new Date(b)
          return ad < bd ? 1 : ad > bd ? -1 : 0
        })
      )
      setDates(dateMap)
    }
  }, [tasksWithAllInfo])

  function handleStart(id) {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  function handleStop(id) {
    setActiveTimersUpdate(activeTimersUpdate - 1)
    stopTimer(id)
  }

  return (
    <>
      <Outlet />
      {dates.size &&
        sortedDates.map((date) => (
          <div key={date} className={styles.tasksContainer}>
            <List
              title={date === 'no' ? 'övriga' : date}
              color=""
              items={dates.get(date).length}
            >
              {dates.get(date).map((task) => (
                <ListContent
                  key={task.id}
                  divider="true"
                  color={task.color}
                  title={
                    task.latest
                      ? `${task.title} - ${timeString(
                          totalTime([task.latest])
                        )}`
                      : task.title
                  }
                  link={`${task.id}`}
                >
                  <Link to={`${task.id}`}>
                    <h2>{task.title}</h2>
                  </Link>
                  {task.activeTimerIndex < 0 && (
                    <>
                      {'timers' in task && (
                        <div>
                          <p>Totalt</p>
                          {timeString(totalTime(task.timers))}
                        </div>
                      )}
                        <p>Senaste</p>
                    </>
                  )}
                  <div>
                    {task.latest ? (
                      <>
                        {timeString(totalTime([task.latest]))}{' '}
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                  <fetcher.Form method="post" action={`${task.id}/start`}>
                    {task.activeTimerIndex < 0 && (
                      <button
                        name="start"
                        value={task.id}
                        className={styles.button}
                      >
                        Starta
                      </button>
                    )}
                  </fetcher.Form>

                  <fetcher.Form
                    method="post"
                    action={`${
                      activeTimers[task.activeTimerIndex]?.id || ''
                    }/stop`}
                  >
                    {task.activeTimerIndex > -1 && (
                      <button
                        name="stop"
                        value={activeTimers[task.activeTimerIndex]?.id || -1}
                        className={styles.button}
                      >
                        Stop
                      </button>
                    )}
                  </fetcher.Form>
                  <fetcher.Form
                    method="post"
                    action={`${task.latest ? task.latest.id : 'no'}/destroy`}
                    onSubmit={(e) => {
                      if (!confirm('Vill du verkligen ta bort denna timer?')) {
                        e.preventDefault()
                      }
                    }}
                  >
                    {task.latest && task.activeTimerIndex < 0 && (
                      <button name="delete" className={styles.button}>
                        Ta bort
                      </button>
                    )}
                  </fetcher.Form>
                </ListContent>
              ))}
            </List>
          </div>
        ))}
        {!dates.size && <div>Inga timers</div>}
    </>
  )
}
