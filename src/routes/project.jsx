import { useEffect, useState } from 'react'
import { Form, Link, useLoaderData } from 'react-router-dom'
import { useTasksContext } from '../contexts/tasksContext'
import { useProjectsContext } from '../contexts/projectsContext'
import ListContent from '../components/ListContent'
import List from '../components/List'
import styles from './Tasks.module.css'

export async function loader({ params }) {
  return params.projectId
}

export default function Project() {
  const id = useLoaderData()
  const { tasks, getTasks } = useTasksContext()
  const { projects, getProject } = useProjectsContext()
  const [project, setProject] = useState()
  const [filteredTasks, setFilteredTasks] = useState([])

  useEffect(() => {
    setFilteredTasks(getTasks(id))
    setProject(getProject(id))
  }, [projects, tasks])

  return (
    <>
      {filteredTasks && project ? (
        <div className={styles.tasksContainer}>
          <List title={project.name} items={projects.length}>
            {filteredTasks.length ? (
              filteredTasks.map((task) => (
                <ListContent
                  key={task.id}
                  divider="true"
                  color={project.color}
                  title={task.title}
                  link={`../tasks/${task.id}`}
                >
                  <Link to={`../tasks/${task.id}`}>
                    <h2>{task.title}</h2>
                  </Link>
                </ListContent>
              ))
            ) : (
              <ListContent
                divider="true"
                color={project.color}
                title={'Inget här'}
                link={''}
              >
              {console.log(project)}
                <h2>Inget här</h2>
              </ListContent>
            )}
          </List>
        </div>
      ) : (
        <p>loading</p>
      )}
      <div className={`${styles.buttonBar}`}>
        <Form action="edit" project={project}>
          <button type="submit" className={`${styles.smallButton}`}>
            Ändra
          </button>
        </Form>
        <Form
          method="post"
          action="destroy"
          onSubmit={(e) => {
            if (!confirm('Vill du verkligen ta bort detta projekt?')) {
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
