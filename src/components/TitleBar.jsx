import styles from './List.module.css'

export default function TitleBar(props) {
  return (
    <div className={`${styles.title} ${styles.border}`}>
    	<h3>{props.title}</h3>
    </div>
  )
}
