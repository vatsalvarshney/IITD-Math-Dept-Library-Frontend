import React from 'react';

const StatsBox = ({ title, value, onClick, isActive }) => (
  <div
    onClick={onClick}
    className={`p-6 rounded-lg shadow-md cursor-pointer transition-all ${
      isActive 
        ? 'bg-primary text-white' 
        : 'bg-white hover:bg-gray-50'
    }`}
  >
    <h3 className={`text-lg font-medium ${
      isActive ? 'text-white' : 'text-gray-500'
    }`}>{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

export default StatsBox;