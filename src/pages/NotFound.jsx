import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="hero min-h-[70vh]">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">404</h1>
          <p className="py-6">Stránka, ktorú hľadáte, nebola nájdená.</p>
          <Link to="/" className="btn btn-primary">Späť domov</Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
