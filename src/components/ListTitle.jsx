import { Link } from 'react-router-dom'

export default function Title({ title, link }) {
  return (
    <>
      <Link to={link}>
        <h2>{title}</h2>
      </Link>
    </>
  )
}
