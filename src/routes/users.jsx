import { useLoaderData, Link, Outlet } from 'react-router-dom'
import { getUsers } from '../api/fetchUserData'

export async function loader() {
	const res = await getUsers()
	console.log(res.data)
  return res.data
}

export default function Users() {
  const users = useLoaderData()
  return (
    <>
      <Link to="/newUser">Skapa ny användare</Link>
      {users.map((user) => (
        <div key={user.user}>
          <Link to={`/${user.user}/overview/projects`}>{user.user}</Link>
        </div>
      ))}
    </>
  )
}
