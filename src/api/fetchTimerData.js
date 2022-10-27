import axios from 'axios'

export async function getTimers(user) {
  return user === 'admin'
    ? axios.get(`${import.meta.env.VITE_URL}/timelogs`)
    : axios.get(`${import.meta.env.VITE_URL}/timelogs?user=${user}`)
}

export async function getTimer(id) {
  return axios.get(`${import.meta.env.VITE_URL}/timelogs/${id}`)
}

export async function getTimerByTask(taskId) {
  return axios.get(`${import.meta.env.VITE_URL}/timelogs?taskId=${taskId}`)
}
