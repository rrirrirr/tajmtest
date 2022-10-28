import { Outlet, NavLink, useLoaderData } from 'react-router-dom'
import styles from './Nav.module.css'
import { useEffect } from 'react'
import { getTimers } from '../api/fetchTimerData'
import { getTasks } from '../api/fetchTasksData'
import { getProjects } from '../api/fetchProjectsData'
import { getUser } from '../api/fetchUserData'
import { useTasksContext } from '../contexts/tasksContext'
import { useTimersContext } from '../contexts/timersContext'
import { useProjectsContext } from '../contexts/projectsContext'

export async function loader({ params }) {
  const user = params.user
  const res = await getUser(user)
  if (!res.data.length) throw new Error('no user')
  const tasks = await getTasks(user)
  const timers = await getTimers(user)
  const projects = await getProjects(user)
  return {
    user,
    tasks: tasks.data,
    timers: timers.data,
    projects: projects.data
  }
  return params.user
}

export default function User() {
  const data = useLoaderData()
  const user = data.user
  const { tasks, setTasks } = useTasksContext()
  const { timers, setTimers } = useTimersContext()
  const { projects, setProjects } = useProjectsContext()

  useEffect(() => {
    setTasks(data.tasks)
    setTimers(data.timers)
    setProjects(data.projects)
  }, [data])

  return (
    <>
      <Outlet />
      <div className={styles.bottomNavPlaceHolder}>&nbsp;</div>
      <div className={styles.bottomNav}>
        <NavLink
          to={`timers`}
          className={({ isActive, isPending }) =>
            isActive ? `${styles.active}` : isPending ? `{$styles.pending}` : ''
          }
        >
          TIMER
        </NavLink>
        <NavLink
          to={`history`}
          className={({ isActive, isPending }) =>
            isActive ? `${styles.active}` : isPending ? `{$styles.pending}` : ''
          }
        >
          HISTORIK
        </NavLink>
        <NavLink
          to={`overview`}
          className={({ isActive, isPending }) =>
            isActive ? `${styles.active}` : isPending ? `{$styles.pending}` : ''
          }
        >
          ÖVERSIKT
        </NavLink>
        <NavLink
          to={`/users`}
          className={({ isActive, isPending }) =>
            isActive ? `${styles.active}` : isPending ? `{$styles.pending}` : ''
          }
        >
          ({user})
        </NavLink>
      </div>
    </>
  )
}
