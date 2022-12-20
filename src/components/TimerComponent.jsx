import { timeString, totalTime, totalTimeToday } from '../utils/utils'
import { useFetcher, useLoaderData, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import styles from './TimerComponent.module.css'

export default function TimerComponent({
  activeTimer = null,
  task,
  path = ''
}) {
  const fetcher = useFetcher()

  return activeTimer ? (
    <>
      <div className={styles.timer}>{timeString(activeTimer.elapsed)}</div>
      <fetcher.Form
        method="post"
        action={`${path}${activeTimer.id}/stop`}
        data-testid="timerForm"
      >
        <button name="stop" value={task.id} className={styles.button}>
          Stop
        </button>
      </fetcher.Form>
    </>
  ) : (
    <fetcher.Form method="post" action={`${path}${task.id}/start`}>
      <button name="start" value={task.id} className={styles.button}>
        Starta
      </button>
    </fetcher.Form>
  )
}
