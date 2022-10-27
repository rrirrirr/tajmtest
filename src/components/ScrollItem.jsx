import { useRef } from 'react'
import { useEffect, useState, Children } from 'react'
import styles from './List.module.css'

const minimumStep = 2

function stepSize(x) {
  return x / 7
}

export default function ScrollItem(props) {
  const [bgColor, setBgColor] = useState('#000000')
  const [update, setUpdate] = useState(50)
  const s = 20
  const p = 200
  const my = (props.index - 1) * s * 3
  const width = useRef(50)
  const stepping = useRef(false)
  const updatedWidth = useRef(50)

  useEffect(() => {
    setBgColor(props.color.length ? props.bgColor : props.children.props.color)
  }, [])

  useEffect(() => {
    getWidth()
  }, [props.position])

  function updateWidth() {
    if (!stepping.current) {
      stepping.current = true
      window.requestAnimationFrame(step)
    }
  }

  function step() {
    const delta = updatedWidth.current - width.current
    let change = stepSize(delta)
    if (Math.abs(change) < minimumStep) {
      change = Math.sign(change) * minimumStep
    }
    if (
      minimumStep >= Math.abs(width.current + change - updatedWidth.current)
    ) {
      width.current = updatedWidth.current
      stepping.current = false
      setUpdate(width.current)
      return
    }
    width.current = change + width.current
    setUpdate(width.current)
    window.requestAnimationFrame(step)
  }

  function getWidth() {
    // console.log(props.position)
    // if (Math.abs(props.position - my) > 50) {
    // console.log('defaulting')
    // return '50px'
    // }
    const val =
      50 + p / Math.pow(Math.E, Math.pow(props.position - my, 2) / (2 * s * s))
    updatedWidth.current = val
    if (val !== width.current) updateWidth()
    // setW
    // return val
    // return width.current
    // return '${width.current}px'
    // return `${200 / props.items}vw`
  }

  function handleScroll(e) {
    console.log(e.target.scrollWidth)
  }

  return (
    <div
      style={{
        background: `linear-gradient(160deg, ${bgColor}, ${bgColor}60)`,
        filter: 'contrast(200%) brightness(120%)',
        width: `${update}px`
      }}
      className={styles.scrollItem}
      onChange={handleScroll}
    >
      {props.children}
    </div>
  )
}
