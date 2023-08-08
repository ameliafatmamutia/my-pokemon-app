import React from 'react';

const PercentageBar = ({ percentage }) => {
  return (
    <div className="relative h-8 bg-gray-300 rounded-full overflow-hidden">
      <div
        className="absolute top-0 left-0 h-full bg-green-500"
        style={{ width: `${percentage}%` }}
      ></div>
      <div className="absolute top-0 right-0 h-full flex items-center pr-2">
        <span className="text-gray-600">{percentage}%</span>
      </div>
    </div>
  );
};

export default PercentageBar;
