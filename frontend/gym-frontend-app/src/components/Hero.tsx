import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 min-h-[80vh] flex items-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Transform Your Body, Transform Your Life
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Join our state-of-the-art gym and start your fitness journey today. 
            Expert trainers, modern equipment, and a supportive community await you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/membership"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              Join Now
            </Link>
            <Link
              to="/classes"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition duration-300"
            >
              View Classes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 