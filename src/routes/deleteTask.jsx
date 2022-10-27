import { redirect } from 'react-router-dom'
import { deleteTask } from '../api/updateTasksData'

export async function action({ params }) {
  await deleteTask(params.taskId)
  return redirect(`/${params.user}/overview/tasks`)
}
