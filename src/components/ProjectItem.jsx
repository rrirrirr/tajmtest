import { Link } from 'react-router-dom'
import styles from './TaskItem.module.css'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'

export default function ProjectItem({ project }) {
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
      <Link to={`${project.id}`}>
        {width}
        {width > 150 ? (
          <>
            <h2>{project.name}</h2>
          </>
        ) : (
          <h2 className={styles.sideways}>{project.name}</h2>
        )}
      </Link>
    </div>
  )
}
