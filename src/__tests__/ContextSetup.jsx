import { Outlet } from 'react-router-dom'
import { getAll } from './fetchall'
import { getTimers } from '../api/fetchTimerData'
import { getTasks } from '../api/fetchTasksData'
import { getProjects } from '../api/fetchProjectsData'
import { getUser } from '../api/fetchUserData'
import { useTasksContext } from '../contexts/tasksContext'
import { useTimersContext } from '../contexts/timersContext'
import { useProjectsContext } from '../contexts/projectsContext'
import { useLoaderData } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'react'

export async function loader({ params }) {
  const user = params.user
  // const all = await getUser(user)
  // if (!res.data.length) throw new Error('no user')
  const projects = await getProjects(user)
  const timers = await getTimers(user)
  const tasks = await getTasks(user)
  const data = {
    user,
    tasks: tasks.data,
    timers: timers.data,
    projects: projects.data
  }
  return data
}

export default function ContextSetup({ children, user }) {
  // const data = useLoaderData()
  // const user = data.user
  const [data, setData] = useState(null)
  const { setTasks } = useTasksContext()
  const { setTimers } = useTimersContext()
  const { setProjects } = useProjectsContext()

  useEffect(() => {
    const fetchData = async () => {
      const projects = await getProjects(user)
      const timers = await getTimers(user)
      const tasks = await getTasks(user)
      const data = {
        user,
        tasks: tasks.data,
        timers: timers.data,
        projects: projects.data
      }
      setData(data)
      setTasks(data.tasks)
      setTimers(data.timers)
      setProjects(data.projects)
    }
    fetchData()
  }, [])

  return <Outlet />
}
