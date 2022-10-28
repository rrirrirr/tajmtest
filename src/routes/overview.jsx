import { NavLink, Outlet } from 'react-router-dom'
import styles from './Overview.module.css'

export default function Overview() {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.tabItem}>
          <NavLink
            to={`tasks`}
            className={({ isActive, isPending }) =>
              isActive
                ? `${styles.active}`
                : isPending
                ? `{$styles.pending}`
                : ''
            }
          >
            TASKS
          </NavLink>
        </div>
        <div className={styles.tabItem}>
          <NavLink
            to={`projects`}
            className={({ isActive, isPending }) =>
              isActive
                ? `${styles.active}`
                : isPending
                ? `{$styles.pending}`
                : ''
            }
          >
            PROJEKT
          </NavLink>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
