import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-purple-600">FitLife</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/classes" className="text-gray-700 hover:text-purple-600 transition duration-300">
              Classes
            </Link>
            <Link to="/trainers" className="text-gray-700 hover:text-purple-600 transition duration-300">
              Trainers
            </Link>
            <Link to="/membership" className="text-gray-700 hover:text-purple-600 transition duration-300">
              Membership
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-purple-600 transition duration-300">
              Contact
            </Link>
            <Link
              to="/login"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Login
            </Link>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-purple-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/classes"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition duration-300"
              >
                Classes
              </Link>
              <Link
                to="/trainers"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition duration-300"
              >
                Trainers
              </Link>
              <Link
                to="/membership"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition duration-300"
              >
                Membership
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition duration-300"
              >
                Contact
              </Link>
              <Link
                to="/login"
                className="block px-3 py-2 text-purple-600 hover:text-purple-700 transition duration-300"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 