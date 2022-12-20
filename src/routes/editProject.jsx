import { useLoaderData, Form, useNavigate, redirect } from 'react-router-dom'
import { useProjectsContext } from '../contexts/projectsContext'
import { useEffect, useState } from 'react'
import { updateProject } from '../api/updateProjectsData'
import styles from './Forms.module.css'
import ColorPicker from '../components/ColorPicker'

export async function action({ request, params }) {
  const formData = await request.formData()
  const updates = Object.fromEntries(formData)
  updates.user = params.user
  const res = await updateProject(params.projectId, updates)
  return redirect(`/${params.user}/overview/projects/${params.projectId}`)
}

export default function EditProject() {
  const id = useLoaderData()
  const { projects, getProject } = useProjectsContext()
  const [project, setProject] = useState()
  const navigate = useNavigate()
  const presetColors = [
    '#f4dbd6',
    '#f0c6c6',
    '#f5bde6',
    '#c6a0f6',
    '#ed8796',
    '#ee99a0',
    '#f5a97f',
    '#eed49f',
    '#a6da95',
    '#8bd5ca',
    '#91d7e3',
    '#7dc4e4',
    '#8aadf4',
    '#b7bdf8'
  ]

  useEffect(() => {
    if (projects.length) setProject(getProject(id))
  }, [projects])

  return (
    <div className={styles.container}>
      {project ? (
        <Form method="post" className={styles.form}>
          <div>
            <input
              placeholder="Project name"
              aria-label="Project name"
              type="text"
              name="name"
              defaultValue={project.name || 'projektnamn'}
              className={styles.textInput}
            />
          </div>
          <ColorPicker
            colors={presetColors}
            startColor={project.color || '#f4dbd6'}
          />
          <div className={styles.buttonBar}>
            <button className={styles.button} type="submit">
              Spara
            </button>
            <button
              className={styles.button}
              type="button"
              onClick={() => navigate(-1)}
            >
              Avbryt
            </button>
          </div>
        </Form>
      ) : (
        <p>loading</p>
      )}
    </div>
  )
}
