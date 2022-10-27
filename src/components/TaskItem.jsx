import { Link } from 'react-router-dom'
import styles from './TaskItem.module.css'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'

export default function TaskItem({ task, children }) {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)
  const [resizeObserver, setResizeObserver] = useState()

  useEffect(() => {
    setWidth(ref.current.clientWidth)
    const ro = new ResizeObserver((entries) => {
      if (ref.current.clientWidth) setWidth(ref.current.clientWidth)
    })
    ro.observe(ref.current)
  }, [])

  return (
    <div
      className={`${styles.container} ${
        width > 190 ? styles.horizontal : styles.vertical
      }`}
      ref={ref}
    >
      {width}
      {width > 150 ? (
        <div>{children}</div>
      ) : (
        <Link to={`${task.id}`}>
          <h2 className={styles.sideways}>{task.title}</h2>
        </Link>
      )}
    </div>
  )
}
