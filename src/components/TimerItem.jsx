import { Link } from 'react-router-dom'
import styles from './TaskItem.module.css'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'

export default function TimerItem({ timer }) {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)
  const [resizeObserver, setResizeObserver] = useState()

  useEffect(() => {
    setWidth(ref.current.clientWidth)
    const ro = new ResizeObserver((entries) =>
      setWidth(ref.current.clientWidth)
    )
    ro.observe(ref.current)
  }, [])

  return (
    <div
      className={`${styles.container} ${
        width > 190 ? styles.horizontal : styles.vertical
      }`}
      ref={ref}
    >
          <Link to={`${timer.id}`}>
      {width}
      {width > 150 ? (
        <>
            <h2>{timer.id}</h2>
        </>
      ) : (
        <h2 className={styles.sideways}>{timer.start}</h2>
      )}
          </Link>
    </div>
  )
}

