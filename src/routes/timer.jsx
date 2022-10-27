import { useFetcher, useLoaderData, Link } from 'react-router-dom'
import { timeString, totalTime, totalTimeToday } from '../utils/utils'
import { useTasksContext } from '../contexts/tasksContext'
import { useTimersContext } from '../contexts/timersContext'
import { useProjectsContext } from '../contexts/projectsContext'
import { useEffect } from 'react'
import { useState } from 'react'
import styles from './Timer.module.css'

export async function loader({ params }) {
  return params.taskId
}

export default function Timer() {
  // const { task, timers } = useLoaderData()
  const fetcher = useFetcher()
  const id = useLoaderData()
  const { tasks, getTask } = useTasksContext()
  const { projects, getProject } = useProjectsContext()
  const { timers, activeTimers, getTimers, getActiveTimerIndex } =
    useTimersContext()
  const [task, setTask] = useState(null)
  const [project, setProject] = useState(null)
  const [total, setTotal] = useState(0)
  const [totalToday, setTotalToday] = useState(0)
  const [activeTimersUpdate, setActiveTimersUpdate] = useState(0)
  const [activeTimersIndex, setActiveTimersIndex] = useState(-1)

  useEffect(() => {
    if (tasks.length && projects.length && timers) {
      const task = getTask(id)
      const project = getProject(task.projectId)
      setProject(project)
      if (timers.length) {
        task.timers = getTimers(id)
        setTotal(totalTime(task.timers))
        setActiveTimersIndex(getActiveTimerIndex(task.id))
      } else {
        task.timers = []
        setTotal(0)
      }
      setTask(task)
    }
  }, [tasks, projects, timers, id])

  useEffect(() => {
    if (activeTimers.length !== activeTimersUpdate && task) {
      setActiveTimersUpdate(activeTimers.length)
      setTask({ ...task, activeTimerIndex: getActiveTimerIndex(task.id) })
    }
  }, [activeTimers])

  return (
    <>
      <div className={styles.topBar}>
        {task ? (
          <>
            <div>
              <Link to={`../../overview/tasks/${task.id}`}>{task.title}</Link>
            </div>
            {task.activeTimerIndex > -1 ? (
              <>
                <b>
                  {timeString(activeTimers[task.activeTimerIndex]?.elapsed)}
                </b>
                <fetcher.Form
                  method="post"
                  action={`../${
                    activeTimers[task.activeTimerIndex]?.id || ''
                  }/stop`}
                >
                  <button name="stop" value={task.id}>
                    Stop
                  </button>
                </fetcher.Form>
              </>
            ) : (
              <>
                <fetcher.Form method="post" action={`../${task.id}/start`}>
                  <button
                    name="start"
                    value={task.id}
                    className={styles.button}
                  >
                    Start
                  </button>
                </fetcher.Form>
              </>
            )}
          </>
        ) : (
          <p>loading</p>
        )}
      </div>
      <div className={styles.topBarPlaceHolder}>-</div>
    </>
  )
}
