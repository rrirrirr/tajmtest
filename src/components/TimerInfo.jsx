import { Link } from 'react-router-dom'
import TimeDisplay from './TimeDisplay'

export default function TimerInfo({ project, timer, task }) {
  return (
    <>
      <Link to={`../../timers/${task.id}`}>
        {new Date(timer.start).toDateString()}
      </Link>
      <TimeDisplay timer={timer} />
      <h2>
        <Link to={`../projects/${project.id}`}>{project.name}</Link>
      </h2>
    </>
  )
}
