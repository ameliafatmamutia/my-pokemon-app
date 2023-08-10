import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeftIcon, HeartIcon } from "@heroicons/react/24/solid";
import PercentageBar from "../component/Detail/percentageBar";
import { db } from "../utils/firebase";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import SkeletonLoadingDetail from "../component/loader/SkeletonLoadingDetail";
import { capitalCase, sentenceCase } from "change-case";
import pokeball from "../assets/images/pokeball.png";
import FloatingActionButton from "../component/FloatingActionButton";
import { useDispatch } from "react-redux";
import { updateCount } from "../utils/redux/favoriteSlice";

function PokemonDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [pokeData, setPokeData] = useState({});
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

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
      dispatch(updateCount(favoriteCount + 1));
    }
    if (type === "dislike") {
      await setDoc(docRef, {
        favoriteName: favoriteName.filter((data) => data !== name),
        favoriteCount: favoriteCount - 1,
      });
      dispatch(updateCount(favoriteCount - 1));
    }
    fetchFavorite();
  };

  const fetchFavorite = async () => {
    const docRef = doc(db, "pokedex", "favoriteList");
    const docSnap = await getDoc(docRef);

    const isFavorited = docSnap.data().favoriteName.includes(name);
    setIsFavorited(isFavorited);
    dispatch(updateCount(docSnap.data().favoriteCount));
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
        abilities: jsonData.abilities, 
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
      navigate("/not-found");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchFavorite();
    fetchPokemonDetail();
  }, []);
  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="mx-auto max-w-2xl py-1 px-4 sm:py-8 sm:px-6 md:max-w-4xl md:px-6 md:py-6 lg:max-w-7xl lg:px-8">
        <div className="flex border-b-2 border-black">
          <ChevronLeftIcon
            className="h-10 w-10 hover:cursor-pointer"
            onClick={() => navigate("/")}
          />
          <p className="text-xl font-semibold p-2">{(pokeData.name || "")}</p>
        </div>

        {isLoading ? (
          <SkeletonLoadingDetail />
        ) : (
          <>
            <div className="h-[155px] bg-customCard my-2 rounded-xl flex flex-row justify-around items-center">
              <div className="flex items-center">
                <img
                  src={pokeData.image || pokeball}
                  alt={pokeData.name}
                  className="border-gray-500 border-r-2 w-[100px] h-[100px] md:w-[130px] md:h-[130px] pr-5"
                />
                <div className="p-2 flex flex-col justify-start pl-7">
                  <p className="text-[12px] font-semibold text-white">
                    {(pokeData.name || "")}
                  </p>
                  <ul className="mt-2 text-white text-[10px]">
                    <li className="whitespace-nowrap">
                      height: {pokeData.height}
                    </li>
                    <li className="whitespace-nowrap">
                      weight: {pokeData.weight}
                    </li>
                    <li className="whitespace-nowrap">
                      abilities:{" "}
                      {pokeData?.abilities?.map(
                        (ability) => (ability.ability.name || "") + ", "
                      )}
                    </li>
                    <li className="whitespace-nowrap">
                      types:{" "}
                      {pokeData?.types?.map(
                        (type) => (type.type.name || "") + ", "
                      )}
                    </li>
                  </ul>
                  <div className="flex flex-row mt-4">
                    <HeartIcon
                      onClick={() => {
                        isFavorited ? updateDoc("dislike") : updateDoc("like");
                      }}
                      className={`mr-2 w-6 h-6 md:w-8 md:h-8 ${
                        isFavorited ? "text-red-500" : "text-white"
                      } hover:cursor-pointer`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex border-b-2 border-black mt-5 mb-1">
              <p className="text-xl font-semibold">Stats</p>
            </div>
            {pokeData?.stats?.map((stat) => (
              <PercentageBar
                key={`barpercentage-${stat.stat.name}`}
                skillName={(stat.stat.name || "")}
                percentage={stat?.base_stat}
              />
            ))}
          </>
        )}
      </div>
      <FloatingActionButton
        handleClickHome={() => navigate("/")}
        handleClickFavorite={() => navigate("/favorite")}
      />
    </div>
  );
}

export default PokemonDetail;
