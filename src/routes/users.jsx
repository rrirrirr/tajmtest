import { useLoaderData, Link, Outlet, Form } from 'react-router-dom'
import { getUsers } from '../api/fetchUserData'
import styles from './Users.module.css'

export async function loader() {
  const res = await getUsers()
  return res.data
}

export default function Users() {
  const users = useLoaderData()
  return (
    <div className={styles.container}>
      <Link to="/newUser">Skapa ny användare</Link>
      {users.map((user) => (
        <div key={user.user}>
          <Link to={`/${user.user}/overview/projects`}>{user.user}</Link>
          <Form
            method="post"
            action={`${user.id}/destroy`}
            onSubmit={(e) => {
              if (!confirm('Vill du verkligen ta bort denna användare?')) {
                e.preventDefault()
              }
            }}
          >
            <button type="submit">
              Ta bort
            </button>
          </Form>
        </div>
      ))}
    </div>
  )
}
