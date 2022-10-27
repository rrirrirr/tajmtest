import { Form } from 'react-router-dom'

export default function StopButton({ timerId, clickCB }) {
  return (
    <Form action={`${timerId}/stop`} method="post">
      <button type="submit" onClick={clickCB}>
        Stop
      </button>
    </Form>
  )
}

