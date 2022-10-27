import TitleBar from './TitleBar'
import HorizontalScroll from './HorizontalScroll'
import ScrollItem from './ScrollItem'
import styles from './List.module.css'

import { Children } from 'react'

export default function List(props) {
  return (
    <div className={styles.container}>
      <TitleBar title={props.title} />
      <HorizontalScroll
        color={props.color}
        items={props.items}
        onScroll={(e) => console.log(e.target.scrollLeft)}
      >
        <div className={styles.ghostItem}>_________</div>
        {props.children}
        <div className={styles.ghostItem}>
          _____________________________________________________________________
        </div>
      </HorizontalScroll>
    </div>
  )
}

// <HorizontalScroll>
//   {items.map((item) => (
//     <ScrollItem item={item} />
//   ))}
// </HorizontalScroll>
