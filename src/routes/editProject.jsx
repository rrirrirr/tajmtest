import { useLoaderData, Form, useNavigate, redirect } from 'react-router-dom'
import { useProjectsContext } from '../contexts/projectsContext'
import { useEffect, useState } from 'react'
import { updateProject } from '../api/updateProjectsData'
import styles from './Forms.module.css'

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
  const [bgColor, setBgColor] = useState('#000000')
  const navigate = useNavigate()
  const presetColors = [
    '#dc8a78',
    '#dd7878',
    '#ea76cb',
    '#8839ef',
    '#d20f39',
    '#e64553',
    '#fe640b',
    '#df8e1d',
    '#40a02b',
    '#179299',
    '#04a5e5',
    '#209fb5',
    '#1e66f5',
    '#7287fd'
  ]

  useEffect(() => {
    if (projects.length) setProject(getProject(id))
  }, [projects])

  useEffect(() => {
    if (project) setBgColor(project.color)
  }, [project])

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
          <div style={{ backgroundColor: bgColor }} className={styles.colorBox}>
            &nbsp;
          </div>
          <div className={styles.colorBar}>
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                style={{ background: presetColor }}
                onClick={() => setBgColor(presetColor)}
                type="button"
                className={styles.colorButton}
              >
                &nbsp;
              </button>
            ))}
          </div>
          <div>
            <input
              placeholder="Project color"
              aria-label="Project color"
              type="text"
              name="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className={styles.textInput}
            />
          </div>
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
