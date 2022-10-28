import { useLoaderData, Form, useNavigate, redirect } from 'react-router-dom'
import { useProjectsContext } from '../contexts/projectsContext'
import { useState, useEffect } from 'react'
import { updateTask } from '../api/updateTasksData'
import { useTasksContext } from '../contexts/tasksContext'
import styles from './Forms.module.css'

export async function action({ request, params }) {
  const formData = await request.formData()
  const updates = Object.fromEntries(formData)
  updates.user = params.user
  const res = await updateTask(params.taskId, updates)
  return redirect(`/${params.user}/overview/tasks/${params.taskId}`)
}

export default function EditTask() {
  const id = useLoaderData()
  const navigate = useNavigate()
  const { tasks, getTask } = useTasksContext()
  const { projects, getProject } = useProjectsContext()
  const [task, setTask] = useState()
  const [filteredProjects, setFilteredProjects] = useState()
  const [projectIndex, setProjectIndex] = useState(0)

  useEffect(() => {
    if (tasks.length) setTask(getTask(id))
  }, [tasks])

  useEffect(() => {
    if (task && filteredProjects.length) {
      filteredProjects.forEach((project, index) => {
        if (task.projectId == project.id) setProjectIndex(index)
      })
    }
  }, [task, filteredProjects])

  useEffect(() => {
    if (projects.length) {
      setFilteredProjects(
        projects.filter((project) => {
          return 'name' in project
        })
      )
    }
  }, [projects])

  return (
    <div className={styles.container}>
      {task ? (
        <Form method="post" className={styles.form}>
        <div>
          <input
            placeholder="Task namn"
            aria-label="Task name"
            type="text"
            name="title"
            defaultValue={task.title || 'task'}
            className={styles.textInput}
          />
          </div>
          <div>
          <select
            name="projectId"
            defaultValue={task.projectId === 'none' ? 0 : task.projectId}
            onChange={(d) => setProjectIndex(d.target.selectedIndex)}
            className={styles.select}
          >
            {filteredProjects?.length &&
              filteredProjects.map((project, index) => {
                return (
                  <option
                    value={project.id}
                    key={project.id}
                    data-index={index}
                  >
                    {project.name}
                  </option>
                )
              })}
          </select>
          </div>
          {filteredProjects?.length && (
            <div
              style={{
                backgroundColor:
                  filteredProjects[projectIndex]?.color || '#000000'
              }}
              className={styles.colorBox}
            >
              &nbsp;
            </div>
          )}
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
        <div>loading</div>
      )}
    </div>
  )
}
