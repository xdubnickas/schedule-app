import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="navbar bg-base-200 shadow-md px-4 lg:px-8">
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <label 
            tabIndex={0} 
            className="btn btn-ghost btn-circle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </label>
          {isMenuOpen && (
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <Link 
                  to="/" 
                  className={location.pathname === '/' ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
            </ul>
          )}
        </div>
        <Link to="/" className="btn btn-ghost text-xl font-bold">
          <span className="text-primary">Schedule</span>Share
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-base">
          <li>
            <Link 
              to="/" 
              className={`px-4 hover:text-primary ${location.pathname === '/' ? 'text-primary font-medium' : ''}`}
            >
              Home
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end space-x-2">
        <Link 
          to="/login" 
          className={`btn btn-ghost hover:bg-base-300 ${location.pathname === '/login' ? 'border-b-2 border-primary' : ''}`}
        >
          Sign In
        </Link>
        <Link 
          to="/register" 
          className="btn btn-primary hover:btn-primary-focus"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
