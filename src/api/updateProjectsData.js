import axios from 'axios'

export async function newProject(data = {}) {
  return axios.post(`${import.meta.env.VITE_URL}/projects`, data)
}

export async function updateProject(id, data) {
  return axios.patch(`${import.meta.env.VITE_URL}/projects/${id}`, data)
}

export async function deleteProject(id) {
  return axios.delete(`${import.meta.env.VITE_URL}/projects/${id}`)
}

export async function deleteProjectByName(name) {
  return axios.delete(`${import.meta.env.VITE_URL}/projects?name=${name}`)
}
