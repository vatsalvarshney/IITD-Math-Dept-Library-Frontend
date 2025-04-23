import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu } from 'lucide-react';
import iitdLogo from '../../assets/logo.png'

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src={iitdLogo} alt="IITD Logo" className="h-12 w-12 mr-2 object-contain" />
              <span className="text-xl font-bold text-primary">Mathematics Library</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
              >
                Home
              </Link>
              <Link
                to="/books"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
              >
                Explore
              </Link>
              <a
                href="https://maths.iitd.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
              >
                Department of Mathematics
              </a>
              <a
                href="https://home.iitd.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
              >
                IIT Delhi
              </a>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'student' && (
                  <Link
                    to={`/profile/${user.username}`}
                    className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                  >
                    Profile
                  </Link>
                )}
                {user.role === 'staff' && (
                  <Link
                    to="/staff"
                    className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
              >
                Login
              </Link>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {/* Mobile navigation items */}
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:text-primary"
            >
              Home
            </Link>
            <Link
              to="/books"
              className="block px-3 py-2 text-gray-700 hover:text-primary"
            >
              Explore
            </Link>
            <a
              href="https://maths.iitd.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 text-gray-700 hover:text-primary"
            >
              Math Department
            </a>
            <a
              href="https://home.iitd.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 text-gray-700 hover:text-primary"
            >
              IITD
            </a>
            {user ? (
              <>
                <Link
                  to={`/profile/${user.username}`}
                  className="block px-3 py-2 text-gray-700 hover:text-primary"
                >
                  Profile
                </Link>
                {user.role === 'staff' && (
                  <Link
                    to="/staff"
                    className="block px-3 py-2 text-gray-700 hover:text-primary"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block px-3 py-2 text-gray-700 hover:text-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 text-gray-700 hover:text-primary"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;