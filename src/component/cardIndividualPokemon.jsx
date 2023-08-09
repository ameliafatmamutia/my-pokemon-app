import { HeartIcon } from "@heroicons/react/24/solid";
import { capitalCase, sentenceCase } from "change-case";
import React from "react";

function CardIndividualPokemon({
  data,
  handleFavorite,
  handleViewDetail,
  isLiked,
}) {
  return (
    <div className="h-200 bg-customCard my-10 p-2 flex">
      <img
        src={data.image}
        alt={data.name}
        className="w-48 h-48 m-4 border-r-4 border-gray-500 pr-4"
      />
      <div className="flex flex-col justify-center ">
        <p className="text-xl font-semibold text-white">
          {capitalCase(data.name || "")}
        </p>
        <ul className="mt-2 text-white">
          <li>Height: {data.height}</li>
          <li>Weight: {data.weight}</li>
          <li>
            Abilities:{" "}
            {data?.abilities?.map(
              (ability) => sentenceCase(ability.ability.name || "") + ", "
            )}
          </li>
          <li>
            Types:{" "}
            {data?.types?.map(
              (type) => sentenceCase(type.type.name || "") + ", "
            )}
          </li>
        </ul>
        <div className="flex flex-row mt-6">
          <HeartIcon
            onClick={() => {
              handleFavorite();
            }}
            className={`mr-4 w-8 h-8 ${
              isLiked ? "text-red-500" : "text-white"
            } hover:text-red-300 hover:cursor-pointer`}
          />
          <button
            onClick={() => handleViewDetail()}
            className="rounded-lg bg-red-500 hover:bg-red-300 p-1 text-sm text-white"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardIndividualPokemon;
