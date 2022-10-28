import axios from 'axios'

export async function addUser(data) {
  return axios.post(`${import.meta.env.VITE_URL}/users`, data)
}

export async function deleteUser(id) {
  return axios.delete(`${import.meta.env.VITE_URL}/users/${id}`)
}



