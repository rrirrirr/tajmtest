import { redirect } from 'react-router-dom'
import { deleteUser } from '../api/updateUserData'
import { getUserById } from '../api/fetchUserData'
import { getProjects, getProjectsById } from '../api/fetchProjectsData'
import { deleteProject } from '../api/updateProjectsData'

export async function action({ params }) {
  const res = await getUserById(params.userId)
  const res2 = await getProjects(res.data.user)
  const projects = res2.data
  if (projects.length) {
    projects.forEach(({ id }) => deleteProject(id))
  }
  await deleteUser(params.userId)
  return redirect(`/users`)
}
