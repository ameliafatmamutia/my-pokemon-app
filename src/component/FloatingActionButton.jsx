import { BookmarkIcon } from "@heroicons/react/24/solid";
import pokeballTab from "../assets/images/Pokeball-tab.png";
import React from "react";
import { useSelector } from "react-redux";

const FloatingActionButton = ({ handleClickHome, handleClickFavorite }) => {
  const { favoriteCount } = useSelector(state => state.favoriteSlice)

  return (
    <div className="fixed bottom-3 w-[220px] left-1/2 transform -translate-x-1/2">
      <div className="flex justify-center h-15 bg-customButton rounded-xl">
        <button
          onClick={handleClickHome}
          className="flex flex-col items-center justify-center py-1 px-5 text-white hover:text-blue-300"
        >
          <span className="relative inline-block">
            <img src={pokeballTab} className="w-5 h-5" />
          </span>

          <p className="ml-1 text-xs">Home</p>
        </button>
        <button
          onClick={handleClickFavorite}
          className="flex items-center flex-col justify-center mt-1 py-1 px-5 text-white hover:text-blue-300"
        >
          <span className="relative inline-block">
            <BookmarkIcon className="w-5 h-5" />
            <span className="absolute bottom-1/2 left-1/8 px-2 py-1 text-xs font-bold leading-none text-red-100 transform bg-red-600 rounded-full">
              {favoriteCount}
            </span>
          </span>

          <p className="ml-1 text-xs">Favorite</p>
        </button>
      </div>
    </div>
  );
};

export default FloatingActionButton;
