import { BookmarkIcon, HomeIcon } from '@heroicons/react/24/solid';
import React from 'react';

const FloatingActionButton = ({ handleClickHome, handleClickFavorite }) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
      <div className="flex h-16 bg-customButton rounded-xl">
        <button
          onClick={handleClickHome}
          className="flex flex-col items-center justify-center mr-6 p-3 text-white hover:text-blue-300"
        >
          <HomeIcon className="w-6 h-6" />
          <p className="ml-1">Home</p>
        </button>
        <button
          onClick={handleClickFavorite}
          className="flex items-center flex-col justify-center p-3 text-white hover:text-blue-300"
        >
          <BookmarkIcon className="w-6 h-6" />
          <p className="ml-1">Favorite</p>
        </button>
      </div>
    </div>
  );
};

export default FloatingActionButton;
