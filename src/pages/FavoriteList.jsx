import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/navbar";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { db } from "../utils/firebase";
import { doc, getDoc } from "@firebase/firestore";
import SkeletonLoadingDetail from "../component/cardDetailLoading";
import { capitalCase, sentenceCase } from "change-case";

function PokemonDetail() {
  const navigate = useNavigate();
  const [favoritePokeList, setFavoritePokeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPokemonDetail = async (name) => {
    try {
      const dataDetail = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${name}`
      );
      const jsonData = await dataDetail.json();
      const pokeData = {
        name: jsonData.name,
        abilities: jsonData.abilities,
        image:
          jsonData.sprites.other.dream_world.front_default ||
          jsonData.sprites.other.home.front_default ||
          jsonData.sprites.other["official-artwork"].front_default,
        weight: jsonData.weight,
        height: jsonData.height,
        types: jsonData.types,
      };
      return pokeData;
    } catch (error) {
      console.log("error");
    }
  };

  const fetchFavorite = async () => {
    const docRef = doc(db, "pokedex", "favoriteList");
    const docSnap = await getDoc(docRef);

    const favoriteName = docSnap.data().favoriteName;

    const newFavoriteList = await Promise.all(
      favoriteName.map(async (name) => {
        const pokeData = await fetchPokemonDetail(name);
        return pokeData;
      })
    );

    setIsLoading(false);

    setFavoritePokeList(newFavoriteList);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchFavorite();
  }, []);

  console.log(favoritePokeList);
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-2xl py-1 px-4 sm:py-8 sm:px-6 md:max-w-4xl md:px-6 md:py-6 lg:max-w-7xl lg:px-8 md:py-6">
        <div className="flex border-b-2 border-black">
          <ChevronLeftIcon
            className="h-10 w-10 hover:cursor-pointer"
            onClick={() => navigate("/")}
          />
          <p className="text-xl p-2"> Favorite </p>
        </div>
        {isLoading && (
          <div>
            <SkeletonLoadingDetail />
            <SkeletonLoadingDetail />
            <SkeletonLoadingDetail />
            <SkeletonLoadingDetail />
            <SkeletonLoadingDetail />
          </div>
        )}
        {favoritePokeList.map((pokeData) => (
          <div className="h-140 bg-customCard my-10 p-2 flex">
            <img
              src={pokeData.image}
              alt={pokeData.name}
              className="w-32 h-32 m-4 border-r-4 border-gray-500 pr-4"
            />
            <div className="flex flex-col justify-center ">
              <p className="text-xl font-semibold text-white">
                {capitalCase(pokeData.name || "")}
              </p>
              <ul className="mt-2 text-white">
                <li>Height: {pokeData.height}</li>
                <li>Weight: {pokeData.weight}</li>
                <li>
                  Abilities:{" "}
                  {pokeData?.abilities?.map(
                    (ability) => sentenceCase(ability.ability.name || "") + ", "
                  )}
                </li>
                <li>
                  Types: {pokeData?.types?.map((type) => sentenceCase(type.type.name || "") + ", ")}
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PokemonDetail;
