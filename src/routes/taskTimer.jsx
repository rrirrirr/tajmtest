import { redirect } from 'react-router-dom'
import { newTimer, updateTimer, deleteTimer } from '../api/updateTimerData'

export async function startTaskTimerAction({ params }) {
  await newTimer({
    user: params.user,
    taskId: params.taskId,
    start: new Date().toISOString(),
    end: '',
  })
  return redirect(`/${params.user}/timers/${params.taskId}`)
}

export async function stopTaskTimerAction({ params }) {
  await updateTimer(params.timerId, {
    taskId: params.taskId,
    end: new Date().toISOString(),
  })
  // return redirect(`/timers`)
}

export async function deleteTaskTimerAction({ params }) {
  await deleteTimer(params.timerId)
  return redirect(`/${params.user}/timers`)
}

