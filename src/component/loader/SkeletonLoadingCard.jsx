import React from 'react';

const SkeletonLoadingCard = () => {
  return (
    <div className="flex flex-col items-center p-4 rounded-xl bg-customCard animate-pulse">
      <div className="w-32 h-32 rounded-full bg-gray-300 mb-4 animate-pulse"/>
      <div className="w-32 h-6 bg-gray-300 rounded mb-2 animate-pulse"/>
      <div className="w-20 h-6 bg-gray-300 rounded mb-2 animate-pulse"/>
    </div>
  );
};

export default SkeletonLoadingCard;
