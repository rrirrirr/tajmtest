export async function getAll() {
  return axios.get(`${import.meta.env.VITE_URL}/all`)
}
