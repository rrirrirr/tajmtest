import axios from 'axios'

export async function newTask(data = {}) {
  return axios.post(`${import.meta.env.VITE_URL}/tasks`, data)
}

export async function updateTask(id, data) {
  return axios.patch(`${import.meta.env.VITE_URL}/tasks/${id}`, data)
}

export async function deleteTask(id) {
  return axios.delete(`${import.meta.env.VITE_URL}/tasks/${id}`)
}

