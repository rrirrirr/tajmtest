import { redirect } from 'react-router-dom'
import { deleteProject } from '../api/updateProjectsData'

export async function action({ params }) {
  await deleteProject(params.projectId)
  return redirect(`/${params.user}/overview/projects`)
}

