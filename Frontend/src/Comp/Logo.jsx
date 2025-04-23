import React from 'react';
import logo from '../assets/logo.png'
const Logo = () => {
  return (
    <div className="flex justify-center mb-8">
      <img 
        src={logo} 
        alt="PCTE Logo"
        className="w-30 h-30 rounded-lg shadow-md"
      />
    </div>
  );
};

export default Logo;