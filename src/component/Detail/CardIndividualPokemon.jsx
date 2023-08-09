import { HeartIcon } from "@heroicons/react/24/solid";
import { capitalCase, sentenceCase } from "change-case";
import React from "react";
import pokeball from "../../assets/images/pokeball.png";

function CardIndividualPokemon({
  data,
  handleFavorite,
  handleViewDetail,
  isLiked,
}) {
  return (
    <div className="h-[240px] bg-customCard my-10 p-2 rounded-xl overflow-hidden">
      <div className="flex items-center">
        <img
          src={data.image || pokeball}
          alt={data.name}
          className="w-24 h-24 md:w-48 md:h-48 m-4 border-gray-500 pr-4"
        />
        <div className="border-l-2 p-2 flex flex-col justify-start px-4 overflow-x-auto">
          <p className="text-xl font-semibold text-white">
            {capitalCase(data.name || "")}
          </p>
          <ul className="mt-2 text-white">
            <li className="whitespace-nowrap mb-1">Height: {data.height}</li>
            <li className="whitespace-nowrap mb-1">Weight: {data.weight}</li>
            <li className="whitespace-nowrap mb-1">
              Abilities:{" "}
              {data?.abilities?.map(
                (ability) => sentenceCase(ability.ability.name || "") + ", "
              )}
            </li>
            <li className="whitespace-nowrap">
              Types:{" "}
              {data?.types?.map(
                (type) => sentenceCase(type.type.name || "") + ", "
              )}
            </li>
          </ul>
          <div className="flex flex-row mt-4">
            <HeartIcon
              onClick={() => {
                handleFavorite();
              }}
              className={`mr-2 w-6 h-6 md:w-8 md:h-8 ${
                isLiked ? "text-red-500" : "text-white"
              } hover:cursor-pointer`}
            />
            <button
              onClick={() => handleViewDetail()}
              className="rounded-lg bg-red-500 p-1 text-sm text-white"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardIndividualPokemon;
