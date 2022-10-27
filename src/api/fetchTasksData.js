import axios from 'axios'

export async function getTasks(user) {
  return user === 'admin'
    ? axios.get(`${import.meta.env.VITE_URL}/tasks`)
    : axios.get(`${import.meta.env.VITE_URL}/tasks?user=${user}`)
}

export async function getTask(id) {
  return axios.get(`${import.meta.env.VITE_URL}/tasks/${id}`)
}
