import React, { useEffect, useState } from "react";
import SkeletonLoadingDetail from "../loader/SkeletonLoadingDetail";
import CarouselList from "../carouselList";
import CardIndividualPokemon from "../Detail/CardIndividualPokemon";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { generateRandomNumbers } from "../../utils/randomArrayNumber";
import { useDispatch } from "react-redux";
import { updateCount } from "../../utils/redux/favoriteSlice";

function HightlightPokemon() {
  const navigate = useNavigate();
  const [highlightedPokemon, setHighlightedPokemon] = useState([]);
  const [isLoadingHightlight, setIsLoadingHightlight] = useState(false);
  const [favoriteNameList, setFavoriteNameList] = useState([]);
  const dispatch = useDispatch();

  const fetchFavorite = async () => {
    const docRef = doc(db, "pokedex", "favoriteList");
    const docSnap = await getDoc(docRef);
    const favoriteName = docSnap.data().favoriteName;
    setFavoriteNameList(favoriteName);
    dispatch(updateCount(docSnap.data().favoriteCount))
  };

  const fetchPokemonDetail = async (id) => {
    try {
      const dataDetail = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
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

  const updateDoc = async (type, name) => {
    const docRef = doc(db, "pokedex", "favoriteList");
    const docSnap = await getDoc(docRef);
    let favoriteName = docSnap.data().favoriteName;
    const favoriteCount = docSnap.data().favoriteCount;

    if (type === "like") {
      const newFavoriteName = [...favoriteName, name];
      await setDoc(docRef, {
        favoriteName: newFavoriteName,
        favoriteCount: favoriteCount + 1,
      });
      dispatch(updateCount(favoriteCount+1))
      setFavoriteNameList(newFavoriteName);
    }
    if (type === "dislike") {
      const newFavoriteName = favoriteName.filter((data) => data !== name);
      await setDoc(docRef, {
        favoriteName: newFavoriteName,
        favoriteCount: favoriteCount - 1,
      });
      dispatch(updateCount(favoriteCount-1))
      setFavoriteNameList(newFavoriteName);
    }
  };

  const fetchRandomPokemon = async () => {
    const pokeIdRandom = generateRandomNumbers(5, 0, 1000);

    const highlightList = await Promise.all(
      pokeIdRandom.map(async (name) => {
        const pokeData = await fetchPokemonDetail(name);
        return pokeData;
      })
    );

    setHighlightedPokemon(highlightList);
    setIsLoadingHightlight(false);
  };

  useEffect(() => {
    setIsLoadingHightlight(true);
    fetchFavorite();
    fetchRandomPokemon();
  }, []);

  return (
    <div>
      <p className="text-black text-2xl font-bold">Highlight</p>
      {isLoadingHightlight ? (
        <SkeletonLoadingDetail />
      ) : (
        <CarouselList>
          {highlightedPokemon.map((pokeData) => (
            <CardIndividualPokemon
              data={pokeData}
              isLiked={favoriteNameList.includes(pokeData.name)}
              handleFavorite={() => {
                favoriteNameList.includes(pokeData.name)
                  ? updateDoc("dislike", pokeData.name)
                  : updateDoc("like", pokeData.name);
              }}
              handleViewDetail={() => navigate("/pokemon/" + pokeData.name)}
            />
          ))}
        </CarouselList>
      )}
    </div>
  );
}

export default HightlightPokemon;
