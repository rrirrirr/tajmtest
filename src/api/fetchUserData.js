import axios from 'axios'

export async function getUsers() {
  return axios.get(`${import.meta.env.VITE_URL}/users`)
}
