import React, { useEffect, useState } from "react";
import { json, useNavigate, useParams } from "react-router-dom";
import Navbar from "../component/navbar";
import { ChevronLeftIcon, HeartIcon } from "@heroicons/react/24/solid";
import PercentageBar from "../component/percentageBar";

function PokemonDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [pokeData, setPokeData] = useState({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchPokemonDetail = async () => {
    try {
      const dataDetail = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${name}`
      );
      const jsonData = await dataDetail.json();
      const pokeData = {
        name: jsonData.name,
        abilities: jsonData.abilities, //Array of abilities
        stats: jsonData.stats,
        image: jsonData.sprites.other.dream_world.front_default,
        weight: jsonData.weight,
        height: jsonData.height,
        types: jsonData.types,
      };
      setPokeData(pokeData);
    } catch (error) {
      console.log("error");
    }
  };

  useEffect(() => {
    fetchPokemonDetail();
  }, []);
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-2xl py-1 px-4 sm:py-8 sm:px-6 md:max-w-4xl md:px-6 md:py-6 lg:max-w-7xl lg:px-8 md:py-6">
        <div className="flex border-b-2 border-black">
          <ChevronLeftIcon
            className="h-10 w-10 hover:cursor-pointer"
            onClick={() => navigate("/")}
          />
          <p className="text-xl p-2">{name}</p>
        </div>

        <div className="h-140 bg-customCard my-10 p-2 flex">
          <img
            src={pokeData.image}
            alt={pokeData.name}
            className="w-32 h-32 m-4 border-r-4 border-gray-500 pr-4"
          />
          <div className="flex flex-col justify-center ">
            <p className="text-xl font-semibold text-white">{pokeData.name}</p>
            <ul className="mt-2 text-white">
              <li>Height: {pokeData.height}</li>
              <li>Weight: {pokeData.weight}</li>
              <li>
                Abilities:{" "}
                {pokeData?.abilities?.map(
                  (ability) => ability.ability.name + ", "
                )}
              </li>
              <li>
                Types: {pokeData?.types?.map((type) => type.type.name + ", ")}
              </li>
            </ul>
          </div>
          <HeartIcon className="w-6 h-6 text-white hover:text-red-300 hover:cursor-pointer" />
        </div>
        {pokeData?.stats?.map((stat) => (
          <div className="flex flex-col my-5">
            <p>{stat.stat.name}</p>
            <PercentageBar percentage={stat.base_stat} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PokemonDetail;
