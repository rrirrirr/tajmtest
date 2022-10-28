import { Link, Form, useLoaderData } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTasksContext } from '../contexts/tasksContext'
import { useProjectsContext } from '../contexts/projectsContext'
import { useTimersContext } from '../contexts/timersContext'
import ListContent from '../components/ListContent'
import List from '../components/List'
import styles from './OverviewDetails.module.css'
import { totalTime, timeString } from '../utils/utils'

export async function loader({ params }) {
  return params.taskId
}

export default function Task() {
  const id = useLoaderData()
  const [task, setTask] = useState()
  const [project, setProject] = useState()
  const [tasksTimers, setTasksTimers] = useState([])
  const { tasks, getTask } = useTasksContext()
  const { projects, getProject } = useProjectsContext()
  const { timers, getTimers } = useTimersContext()

  useEffect(() => {
    if (timers?.length && task && !tasksTimers.length)
      setTasksTimers(getTimers(task.id))
    if (task && projects && !project) setProject(getProject(task.projectId))
  }, [timers, task, projects])

  useEffect(() => {
    setTask(getTask(id))
  }, [tasks])

  return (
    <>
      {task && tasksTimers && project ? (
        <div className={styles.tasksContainer}>
          <List title={task.title} color="" items={tasksTimers.length}>
            {tasksTimers.length ? (
              tasksTimers.map((timer) => (
                <ListContent
                  key={timer.id}
                  divider="true"
                  color={project.color}
                  title={new Date(timer.start).toDateString()}
                  link={`../../timers/${task.id}`}
                >
                  <Link to={`../../timers/${task.id}`}>
                    {new Date(timer.start).toDateString()}
                  </Link>
                  <p><b>
                  	{timeString(totalTime(timer))}
                  </b>
                  </p>
                  <h2>
                    <Link to={`../projects/${project.id}`}>{project.name}</Link>
                  </h2>
                </ListContent>
              ))
            ) : (
              <ListContent
                divider="true"
                color={project.color}
                title={'Inget här'}
                link={''}
              >
                <h2>Inget här</h2>
              </ListContent>
            )}
          </List>
        </div>
      ) : (
        <p>Inget att visa</p>
      )}
      <div className={`${styles.buttonBar}`}>
        <Form action="edit" task={task}>
          <button type="submit" className={`${styles.smallButton}`}>
            Ändra
          </button>
        </Form>
        <Form
          method="post"
          action="destroy"
          onSubmit={(e) => {
            if (!confirm('Vill du verkligen ta bort denna task?')) {
              e.preventDefault()
            }
          }}
        >
          <button type="submit" className={`${styles.smallButton}`}>
            Ta bort
          </button>
        </Form>
      </div>
    </>
  )
}
