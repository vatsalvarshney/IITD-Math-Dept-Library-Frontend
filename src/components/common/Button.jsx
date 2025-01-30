import React from 'react';

const Button = ({ children, loading, ...props }) => (
  <button
    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
      loading ? 'opacity-75 cursor-not-allowed' : ''
    }`}
    disabled={loading}
    {...props}
  >
    {loading ? (
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
    ) : (
      children
    )}
  </button>
);

export default Button;