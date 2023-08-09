import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeftIcon, HeartIcon } from "@heroicons/react/24/solid";
import PercentageBar from "../component/Detail/percentageBar";
import { db } from "../utils/firebase";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import SkeletonLoadingDetail from "../component/loader/SkeletonLoadingDetail";
import { capitalCase, sentenceCase } from "change-case";
import pokeball from '../assets/images/pokeball.png'
import FloatingActionButton from "../component/FloatingActionButton";

function PokemonDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [pokeData, setPokeData] = useState({});
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

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
    setIsFavorited(isFavorited);
    setFavoriteCount(docSnap.data().favoriteCount);
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
      navigate('/not-found')
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchFavorite();
    fetchPokemonDetail();
  }, []);
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-2xl py-1 px-4 sm:py-8 sm:px-6 md:max-w-4xl md:px-6 md:py-6 lg:max-w-7xl lg:px-8 md:py-6">
        <div className="flex border-b-2 border-black">
          <ChevronLeftIcon
            className="h-10 w-10 hover:cursor-pointer"
            onClick={() => navigate("/")}
          />
          <p className="text-xl p-2">{capitalCase(pokeData.name || "")}</p>
        </div>

        {isLoading ? <SkeletonLoadingDetail /> : (
           <>
           <div className="h-200 bg-customCard my-10 p-2 flex rounded-xl">
             <img
               src={pokeData.image || pokeball}
               alt={pokeData.name}
               className="w-48 h-48 m-4 border-r-4 border-gray-500 pr-4"
             />
             <div className="flex flex-col justify-center ">
               <p className="text-xl font-semibold text-white">
                 {capitalCase(pokeData?.name || "")}
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
                     (type) => sentenceCase(type?.type.name || "") + ", "
                   )}
                 </li>
               </ul>
               <div className="flex flex-row mt-6">
                 <HeartIcon
                   onClick={() => {
                     isFavorited ? updateDoc("dislike") : updateDoc("like");
                   }}
                   className={`mr-4 w-8 h-8 ${isFavorited ? "text-red-500" : "text-white"
                     } hover:cursor-pointer`}
                 />
               </div>
             </div>
           </div>
           <div className="flex border-b-2 border-black">
             <p className="text-2xl font-semibold p-2">Stats : </p>
           </div>
           {pokeData?.stats?.map((stat) => (
             <PercentageBar skillName={sentenceCase(stat.stat.name || "")} percentage={stat?.base_stat} />
           ))}
         </>
        )}

      </div>
      <FloatingActionButton
          handleClickHome={() => navigate("/")}
          handleClickFavorite={() => navigate("/favorite")}
          totalFavorited={favoriteCount} //change to a number
        />
    </div>
  );
}

export default PokemonDetail;
