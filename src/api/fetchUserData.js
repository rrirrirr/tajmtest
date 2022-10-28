import axios from 'axios'

export async function getUsers() {
  return axios.get(`${import.meta.env.VITE_URL}/users`)
}

export async function getUser(user) {
  return axios.get(`${import.meta.env.VITE_URL}/users?user=${user}`)
}

export async function getUserById(id) {
  return axios.get(`${import.meta.env.VITE_URL}/users/${id}`)
}


