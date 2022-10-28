import styles from './List.module.css'
import ScrollItem from './ScrollItem'
import { Children, useState } from 'react'

export default function HorizontalScroll(props) {
  const [scrollPosition, setScrollPosition] = useState(0)

  function handleScroll(e) {
    // if(Math.abs(e.target.scrollLeft - scrollPosition) > 10) setScrollPosition(e.target.scrollLeft)
    setScrollPosition(e.target.scrollLeft)
  }

  return (
    <div className={styles.horizontalScroll} onScroll={handleScroll}>
      {Children.map(props.children, (child, index) =>
        child.props.divider === 'true' ? (
          <ScrollItem
            color={props.color || ''}
            position={scrollPosition}
            index={index}
            items={props.items}
          >
            {child}
          </ScrollItem>
        ) : (
          child
        )
      )}
    </div>
  )
}
