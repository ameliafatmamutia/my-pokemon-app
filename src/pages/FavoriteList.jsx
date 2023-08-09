import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { db } from "../utils/firebase";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import SkeletonLoadingDetail from "../component/loader/SkeletonLoadingDetail";
import CardIndividualPokemon from "../component/Detail/CardIndividualPokemon";
import FloatingActionButton from "../component/FloatingActionButton";

function FavoriteList() {
  const navigate = useNavigate();
  const [favoritePokeList, setFavoritePokeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [favoriteName, setFavoriteName] = useState([]);

  const updateDoc = async (name) => {
    const docRef = doc(db, "pokedex", "favoriteList");
    const docSnap = await getDoc(docRef);
    let favoriteName = docSnap.data().favoriteName;
    const favoriteCount = docSnap.data().favoriteCount;

    await setDoc(docRef, {
      favoriteName: favoriteName.filter((nameData) => nameData !== name),
      favoriteCount: favoriteCount - 1,
    });
    fetchFavorite();
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
    setFavoriteName(favoriteName);
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-2xl py-1 px-4 sm:py-8 sm:px-6 md:max-w-4xl md:px-6 md:py-6 lg:max-w-7xl lg:px-8 md:py-6">
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
          <CardIndividualPokemon
            data={pokeData}
            isLiked={favoriteName.includes(pokeData.name)}
            handleFavorite={() => updateDoc(pokeData.name)}
            handleViewDetail={() => navigate("/pokemon/" + pokeData.name)}
          />
        ))}
        <div className="flex items-center">
          <p className="text-black text-2xl">{`Total favorite pokemon : ${favoriteCount}`}</p>
        </div>
      </div>
      <FloatingActionButton
          handleClickHome={() => navigate("/")}
          handleClickFavorite={scrollToTop}
          totalFavorited={favoriteCount} //change to a number
        />
    </div>
  );
}

export default FavoriteList;
