import { Link, Form, redirect } from 'react-router-dom'
import {
  useProjectsContext,
  ProjectsContext
} from '../contexts/projectsContext'
import { useEffect, useContext } from 'react'
import { newProject } from '../api/updateProjectsData'
import List from '../components/List'
import ListContent from '../components/ListContent'
import styles from './Projects.module.css'

export async function action({ params }) {
  try {
    const project = await newProject({ user: params.user })
    const id = project.data.id
    return redirect(`/${params.user}/overview/projects/${id}/edit`)
  } catch (error) {
    console.log(error)
  }
}

export default function Projects() {
  const { projects } = useProjectsContext()

  return (
    <>
      {projects.length ? (
        <div className={styles.tasksContainer}>
          <List title="PROJEKT" color="" items={projects.length}>
            {projects
              .filter((project) => 'name' in project)
              .map((project) => (
                <ListContent
                  key={project.id}
                  divider="true"
                  color={project.color}
                  title={project.name}
                  link={project.id}
                >
                  <Link to={project.id}>
                    <h2>{project.name}</h2>
                  </Link>
                </ListContent>
              ))}
          </List>
        </div>
      ) : (
        <p>no projects</p>
      )}
      <Form method="post">
        <button className={`${styles.border} ${styles.button}`}>
          Lägg till projekt
        </button>
      </Form>
    </>
  )
}
