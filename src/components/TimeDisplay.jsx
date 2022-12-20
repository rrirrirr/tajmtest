import { timeString, totalTime } from '../utils/utils'

export default function TimeDisplay({ timer }) {
  return (
    <p>
      <b>{timeString(totalTime(timer))}</b>
    </p>
  )
}
