import React from 'react';

const Logo = ({ size = 44, className = '' }) => {
  return (
    <img 
      src="/assets/logo.png" 
      alt="TrinetLayer Logo"
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        outline: 'none',
        borderRadius: 0
      }}
    />
  );
};

export default Logo;
