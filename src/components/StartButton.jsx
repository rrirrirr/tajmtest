import { Form } from 'react-router-dom'

export default function StartButton({ taskId, clickCB }) {
  return (
    <Form action={`${taskId}/start`} method="post">
      <button type="submit" onClick={clickCB}>
        start
      </button>
    </Form>
  )
}
