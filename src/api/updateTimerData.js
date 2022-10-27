import axios from 'axios'

export async function newTimer(data = {}) {
  return axios.post(`${import.meta.env.VITE_URL}/timelogs`, data)
}

export async function updateTimer(id, data) {
  return axios.patch(`${import.meta.env.VITE_URL}/timelogs/${id}`, data)
}

export async function deleteTimer(id) {
  return axios.delete(`${import.meta.env.VITE_URL}/timelogs/${id}`)
}


