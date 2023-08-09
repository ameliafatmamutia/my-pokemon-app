import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, HeartIcon } from "@heroicons/react/24/solid";
import { db } from "../utils/firebase";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import SkeletonLoadingDetail from "../component/cardDetailLoading";
import { capitalCase, sentenceCase } from "change-case";

function FavoriteList() {
  const navigate = useNavigate();
  const [favoritePokeList, setFavoritePokeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [favoriteName, setFavoriteName] = useState([])

  const updateDoc = async (name) => {
    const docRef = doc(db, "pokedex", "favoriteList");
    const docSnap = await getDoc(docRef);
    let favoriteName = docSnap.data().favoriteName;
    const favoriteCount = docSnap.data().favoriteCount;

    await setDoc(docRef, {
        favoriteName: favoriteName.filter((nameData) => nameData !== name),
        favoriteCount: favoriteCount - 1,
    });
    fetchFavorite()
  };

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
    setFavoriteName(favoriteName)
    setFavoriteCount(docSnap.data().favoriteCount);

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

  return (
    <div className="bg-white min-h-screen">
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
          <div className="h-200 bg-customCard my-10 p-2 flex">
            <img
              src={pokeData.image}
              alt={pokeData.name}
              className="w-48 h-48 m-4 border-r-4 border-gray-500 pr-4"
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
                  Types:{" "}
                  {pokeData?.types?.map(
                    (type) => sentenceCase(type.type.name || "") + ", "
                  )}
                </li>
              </ul>
              <div className="flex flex-row mt-6">
                <HeartIcon
                  onClick={() => {updateDoc(pokeData.name)}}
                  className={`mr-4 w-8 h-8 ${
                    favoriteName.includes(pokeData.name) ? "text-red-500" : "text-white"
                  } hover:text-red-300 hover:cursor-pointer`}
                />
                <button onClick={() => navigate('/pokemon/'+pokeData.name) } className="rounded-lg bg-red-500 hover:bg-red-300 p-1 text-sm text-white">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="flex items-center">
          <p className="text-black text-2xl">{`Total favorite pokemon : ${favoriteCount}`}</p>
        </div>
      </div>
    </div>
  );
}

export default FavoriteList;
