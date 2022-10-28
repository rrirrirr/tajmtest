import { Link } from 'react-router-dom'
import styles from './ListContent.module.css'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'

export default function TaskItem({ title, children, link }) {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)
  const [resizeObserver, setResizeObserver] = useState()

  useEffect(() => {
    setWidth(ref.current.clientWidth)
    const ro = new ResizeObserver((entries) => {
      if (ref.current?.clientWidth) setWidth(ref.current.clientWidth)
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
      {width > 150 ? (
        <div>{children}</div>
      ) : (
        <Link to={`${link}`}>
          <h2 className={styles.sideways}>{title}</h2>
        </Link>
      )}
    </div>
  )
}
