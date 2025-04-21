import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <div className="hero bg-base-200 rounded-lg p-6 mb-6">
        <div className="hero-content text-center">
          <div>
            <h1 className="text-5xl font-bold mb-4">Schedule Share</h1>
            <p className="py-4">Modern application for creating and sharing schedules.</p>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
