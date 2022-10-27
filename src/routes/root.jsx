import { useEffect } from 'react'
import { useLocation, Link, Outlet, useNavigate } from 'react-router-dom'
import styles from './Root.module.css'

export default function Root() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if(location.pathname === '/') navigate('users')
  }, [])

  return (
    <div className={styles.container}>
      <Outlet />
    </div>
  )
}
