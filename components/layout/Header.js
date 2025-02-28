import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-purple-800 to-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <svg
                className="w-8 h-8 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                <path
                  d="M7 13L10 16L17 9"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-xl font-bold">CryptoTracker</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`hover:text-blue-200 ${router.pathname === '/' ? 'font-bold' : ''}`}>
              Home
            </Link>

            {isAuthenticated() ? (
              <>
                <Link href="/dashboard" className={`hover:text-blue-200 ${router.pathname === '/dashboard' ? 'font-bold' : ''}`}>
                  Dashboard
                </Link>
                <Link href="/portfolio" className={`hover:text-blue-200 ${router.pathname === '/portfolio' ? 'font-bold' : ''}`}>
                  Portfolio
                </Link>
                <div className="relative group">
                  <button className="flex items-center hover:text-blue-200">
                    <FiUser className="mr-1" />
                    {user?.name || 'Account'}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link href="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      <FiSettings className="inline mr-2" /> Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      <FiLogOut className="inline mr-2" /> Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className={`hover:text-blue-200 ${router.pathname === '/login' ? 'font-bold' : ''}`}>
                  Login
                </Link>
                <Link href="/register" className="bg-white text-purple-700 hover:bg-blue-100 px-4 py-2 rounded-md font-medium">
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link href="/" className={`block hover:text-blue-200 ${router.pathname === '/' ? 'font-bold' : ''}`}>
              Home
            </Link>

            {isAuthenticated() ? (
              <>
                <Link href="/dashboard" className={`block hover:text-blue-200 ${router.pathname === '/dashboard' ? 'font-bold' : ''}`}>
                  Dashboard
                </Link>
                <Link href="/portfolio" className={`block hover:text-blue-200 ${router.pathname === '/portfolio' ? 'font-bold' : ''}`}>
                  Portfolio
                </Link>
                <Link href="/settings" className={`block hover:text-blue-200 ${router.pathname === '/settings' ? 'font-bold' : ''}`}>
                  Settings
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left hover:text-blue-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={`block hover:text-blue-200 ${router.pathname === '/login' ? 'font-bold' : ''}`}>
                  Login
                </Link>
                <Link href="/register" className="block bg-white text-purple-700 hover:bg-blue-100 px-4 py-2 rounded-md font-medium text-center mt-4">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;