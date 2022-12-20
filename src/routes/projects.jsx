import { Link, Form, redirect } from 'react-router-dom'
import {
  useProjectsContext,
  ProjectsContext
} from '../contexts/projectsContext'
import { useEffect, useContext } from 'react'
import { newProject } from '../api/updateProjectsData'
import List from '../components/List'
import ListTitle from '../components/ListTitle'
import ListContent from '../components/ListContent'
import styles from './OverviewDetails.module.css'

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
                  <ListTitle link={project.id} title={project.name} />
                </ListContent>
              ))}
          </List>
        </div>
      ) : (
        <p>Inga projekt</p>
      )}
      <div className={`${styles.buttonBar}`}>
        <Form method="post">
          <button className={`${styles.button}`}>Lägg till projekt</button>
        </Form>
      </div>
    </>
  )
}
