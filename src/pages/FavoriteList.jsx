import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import SkeletonLoadingDetail from "../component/loader/SkeletonLoadingDetail";
import CardIndividualPokemon from "../component/Detail/CardIndividualPokemon";
import FloatingActionButton from "../component/FloatingActionButton";
import { useDispatch, useSelector } from "react-redux";
import { updateCount } from "../utils/redux/favoriteSlice";
import { toast } from "react-hot-toast";

function FavoriteList() {
  const navigate = useNavigate();
  const [favoritePokeList, setFavoritePokeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteName, setFavoriteName] = useState([]);
  const dispatch = useDispatch();
  const { favoriteCount } = useSelector(state => state.favoriteSlice)

  const updateDoc = async (name) => {
    const docRef = doc(db, "pokedex", "favoriteList");
    const docSnap = await getDoc(docRef);
    let favoriteName = docSnap.data().favoriteName;
    const favoriteCount = docSnap.data().favoriteCount;

    await setDoc(docRef, {
      favoriteName: favoriteName.filter((nameData) => nameData !== name),
      favoriteCount: favoriteCount - 1,
    });
    dispatch(updateCount(favoriteCount-1))
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
      toast.error('Error while fetching pokemon detail')
    }
  };

  const fetchFavorite = async () => {
    try {
      const docRef = doc(db, "pokedex", "favoriteList");
      const docSnap = await getDoc(docRef);

      const favoriteName = docSnap.data().favoriteName;
      setFavoriteName(favoriteName);
      dispatch(updateCount(docSnap.data().favoriteCount))

      const newFavoriteList = await Promise.all(
        favoriteName.map(async (name) => {
          const pokeData = await fetchPokemonDetail(name);
          return pokeData;
        })
      );

      setIsLoading(false);

      setFavoritePokeList(newFavoriteList);
    } catch (error) {
      toast.error('Error while fetch pokemon favorite')
      setIsLoading(false);
    }
    
  };

  useEffect(() => {
    setIsLoading(true);
    fetchFavorite();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-slate-100 min-h-screen ">
      <div className="py-3 px-4 sm:px-6 md:px-6 lg:px-8">
        <p className="text-xl font-semibold">Favorites</p>
      </div>
      <div className="mx-auto max-w-2xl px-4 sm:py-8 sm:px-6 md:max-w-4xl md:px-6 md:py-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-4">
        {isLoading && (
          <>
            <SkeletonLoadingDetail />
            <SkeletonLoadingDetail />
            <SkeletonLoadingDetail />
            <SkeletonLoadingDetail />
            <SkeletonLoadingDetail />
            <SkeletonLoadingDetail />
          </>
        )}
        {favoritePokeList?.map((pokeData) => (
          <CardIndividualPokemon
            key={`cardFavorite-${pokeData?.name}`}
            data={pokeData}
            isLiked={favoriteName.includes(pokeData?.name)}
            handleFavorite={() => updateDoc(pokeData?.name)}
            handleViewDetail={() => navigate("/pokemon/" + pokeData?.name)}
          />
        ))}
        </div>       
        <div className="flex justify-center items-center mt-5">
          <p className="text-black text-xl">{`Total favorite pokemon: ${favoriteCount}`}</p>
        </div>
      </div>
      <FloatingActionButton
          handleClickHome={() => navigate("/")}
          handleClickFavorite={scrollToTop}
        />
    </div>
  );
}

export default FavoriteList;
