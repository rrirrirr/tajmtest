import { Link, Form, redirect } from 'react-router-dom'
import { useTasksContext } from '../contexts/tasksContext'
import { useProjectsContext } from '../contexts/projectsContext'
import { useEffect, useState } from 'react'
import { newTask } from '../api/updateTasksData'
import { combineArraysByKey } from '../utils/data'
import List from '../components/List'
import ListContent from '../components/ListContent'
import styles from './OverviewDetails.module.css'

export async function loader() {}

export async function action({ params }) {
  try {
    const task = await newTask({ user: params.user })
    const id = task.data.id
    return redirect(`/${params.user}/overview/tasks/${id}/edit`)
  } catch (error) {
    console.log(error)
  }
}

export default function Tasks() {
  const { tasks } = useTasksContext()
  const { projects, getProject } = useProjectsContext()
  const [tasksWithProjectInfo, setTasksWithProjectInfo] = useState()

  useEffect(() => {}, [])

  useEffect(() => {
    if (tasks.length && projects.length) {
      setTasksWithProjectInfo(
        combineArraysByKey([
          { array: tasks, key: 'projectId', props: 'all' },
          {
            array: projects,
            key: 'id',
            props: { color: 'color', name: 'projectName' }
          }
        ]).filter((task) => 'title' in task)
      )
    }
  }, [tasks, projects])

  return (
    <>
      {tasksWithProjectInfo?.length ? (
        <div className={styles.tasksContainer}>
          <List title="TASKS" color="" items={tasksWithProjectInfo.length}>
            {tasksWithProjectInfo.map((task) => (
              <ListContent
                key={task.id}
                divider="true"
                color={task.color}
                title={task.title}
                link={task.id}
              >
                <Link to={task.id}>
                  <h2>{task.title}</h2>
                </Link>
                <Link to={`../projects/${task.projectId}`}>
                  <p>{task.projectName}</p>
                </Link>
              </ListContent>
            ))}
          </List>
        </div>
      ) : (
        <p>Inga tasks</p>
      )}
      <div className={styles.buttonBar}>
      <Form method="post">
        <button className={`${styles.button}`}>
          Lägg till task
        </button>
      </Form>
      </div>
    </>
  )
}
