import { BookmarkIcon, HomeIcon } from "@heroicons/react/24/solid";
import React from "react";

const FloatingActionButton = ({ handleClickHome, handleClickFavorite,totalFavorited }) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
      <div className="flex h-18 bg-customButton rounded-xl">
        <button
          onClick={handleClickHome}
          className="flex flex-col items-center justify-center mr-6 p-3 text-white hover:text-blue-300"
        >
          <span class="relative inline-block">
            <HomeIcon className="w-6 h-6" />
          </span>

          <p className="ml-1">Home</p>
        </button>
        <button
          onClick={handleClickFavorite}
          className="flex items-center flex-col justify-center p-4 text-white hover:text-blue-300"
        >
          <span class="relative inline-block">
            <BookmarkIcon className="w-6 h-6" />
            <span class="absolute bottom-1/2 left-1/8 px-2 py-1 text-xs font-bold leading-none text-red-100 transform bg-red-600 rounded-full">
              {totalFavorited}
            </span>
          </span>

          <p className="ml-1">Favorite</p>
        </button>
      </div>
    </div>
  );
};

export default FloatingActionButton;
