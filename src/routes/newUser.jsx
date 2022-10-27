import { Form, useNavigate, redirect } from 'react-router-dom'
import { addUser } from '../api/updateUserData'

export async function action({ request, params }) {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  console.log(data)
  const res = await addUser(data)
  console.log(res)
  return redirect(`/${data.user}/overview/projects`)
}

export default function AddUser() {
  const navigate = useNavigate()
  return (
    <>
      <Form method="post">
        <input
          placeholder="användarnamn"
          type="text"
          name="user"
          defaultValue="användarnamn"
        />
        <p>
          <button type="submit">Spara</button>
          <button type="button" onClick={() => navigate(-1)}>
            Avbryt
          </button>
        </p>
      </Form>
    </>
  )
}
