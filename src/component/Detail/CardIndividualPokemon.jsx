import { HeartIcon } from "@heroicons/react/24/solid";
import { capitalCase } from "change-case";
import React from "react";
import pokeball from "../../assets/images/pokeball.png";

function CardIndividualPokemon({
  data,
  handleFavorite,
  handleViewDetail,
  isLiked,
}) {
  return (
    <div className="h-[150px] bg-customCard my-2 rounded-xl flex flex-row justify-around">
      <div className="flex items-center">
        <img
          src={data?.image || pokeball}
          alt={data?.name}
          className="w-[70px] h-[70px] md:w-[130px] md:h-[130px] m-4 justify-end"
        />
        <div className="p-2 flex flex-col justify-start px-4 w-[200px] overflow-auto ">
          <p className="text-[12px] font-semibold text-white">
            {capitalCase(data?.name || "")}
          </p>
          <ul className="mt-2 text-white text-[10px]">
            <li className="whitespace-nowrap">height: {data?.height}</li>
            <li className="whitespace-nowrap">weight: {data?.weight}</li>
            <li className="whitespace-nowrap">
              abilities:{" "}
              {data?.abilities?.map(
                (ability) => (ability.ability.name || "") + ", "
              )}
            </li>
            <li className="whitespace-nowrap">
              types:{" "}
              {data?.types?.map(
                (type) => (type.type.name || "") + ", "
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
              className="rounded-lg bg-[#CC4B00] py-1 px-3 text-xs text-white"
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