import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../component/navbar";
import { ChevronLeftIcon, HeartIcon } from "@heroicons/react/24/solid";
import PercentageBar from "../component/percentageBar";
import { db } from "../utils/firebase";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import SkeletonLoadingDetail from "../component/cardDetailLoading";
import { capitalCase, sentenceCase } from "change-case";

function PokemonDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [pokeData, setPokeData] = useState({});
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateDoc = async (type) => {
    const docRef = doc(db, "pokedex", "favoriteList");
    const docSnap = await getDoc(docRef);
    let favoriteName = docSnap.data().favoriteName;
    const favoriteCount = docSnap.data().favoriteCount;

    if (type === "like") {
      await setDoc(docRef, {
        favoriteName: [...favoriteName, name],
        favoriteCount: favoriteCount + 1,
      });
    }
    if (type === "dislike") {
      await setDoc(docRef, {
        favoriteName: favoriteName.filter((data) => data !== name),
        favoriteCount: favoriteCount - 1,
      });
    }
    fetchFavorite();
  };

  const fetchFavorite = async () => {
    const docRef = doc(db, "pokedex", "favoriteList");
    const docSnap = await getDoc(docRef);

    const isFavorited = docSnap.data().favoriteName.includes(name);
    console.log(docSnap.data().favoriteName, "fav name");
    setIsFavorited(isFavorited);
  };

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
        image:
          jsonData.sprites.other.dream_world.front_default ||
          jsonData.sprites.other.home.front_default ||
          jsonData.sprites.other["official-artwork"].front_default,
        weight: jsonData.weight,
        height: jsonData.height,
        types: jsonData.types,
      };
      setPokeData(pokeData);
      setIsLoading(false);
    } catch (error) {
      console.log("error");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchFavorite();
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
          <p className="text-xl p-2">{capitalCase(name || "")}</p>
        </div>

        {isLoading && <SkeletonLoadingDetail />}

        <div className="h-140 bg-customCard my-10 p-2 flex">
          <img
            src={pokeData.image}
            alt={pokeData.name}
            className="w-32 h-32 m-4 border-r-4 border-gray-500 pr-4"
          />
          <div className="flex flex-col justify-center ">
            <p className="text-xl font-semibold text-white">{capitalCase(pokeData?.name || "")}</p>
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
                Types: {pokeData?.types?.map((type) => sentenceCase(type?.type.name || "") + ", ")}
              </li>
            </ul>
          </div>
          <HeartIcon
            onClick={() => {
              isFavorited ? updateDoc("dislike") : updateDoc("like");
            }}
            className={`w-6 h-6 ${
              isFavorited ? "text-red-500" : "text-white"
            } hover:text-red-300 hover:cursor-pointer`}
          />
        </div>
        {pokeData?.stats?.map((stat) => (
          <div className="flex flex-col my-5">
            <p>{sentenceCase(stat.stat.name || "")}</p>
            <PercentageBar percentage={stat?.base_stat} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PokemonDetail;
