import axios from 'axios'

export async function getProjects(user) {
  return user === 'admin'
    ? axios.get(`${import.meta.env.VITE_URL}/projects`)
    : axios.get(`${import.meta.env.VITE_URL}/projects?user=${user}`)
}

export async function getProjectsById(id) {
  return axios.get(`${import.meta.env.VITE_URL}/projects?user=${user}`)
}


export async function getProject(id) {
  return axios.get(`${import.meta.env.VITE_URL}/projects/${id}`)
}
