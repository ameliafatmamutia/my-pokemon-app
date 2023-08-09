import React, { useEffect, useState } from 'react'
import { doc, getDoc } from "firebase/firestore";
import PokemonCardComponent from './PokemonCardComponent';
import { db } from '../../utils/firebase';
import { useDispatch } from "react-redux";
import { updateCount } from "../../utils/redux/favoriteSlice";

const PokemonCardList = ({ pokemonData }) => {
    const [favoriteNameList, setFavoriteNameList] = useState([]);
    const dispatch = useDispatch();

    const fetchFavorite = async () => {
      const docRef = doc(db, "pokedex", "favoriteList");
      const docSnap = await getDoc(docRef);
  
      const favoriteName = docSnap.data().favoriteName;
      setFavoriteNameList(favoriteName);
      dispatch(updateCount(docSnap.data().favoriteCount))
    };
  
    useEffect(() => {
      fetchFavorite();
    }, []);
  
    const handleFavorite = (type, targetName) => {
      if (type === "like") {
        setFavoriteNameList([...favoriteNameList, targetName]);
      }
      if (type === "dislike") {
        const newFavoriteList = favoriteNameList.filter(
          (data) => data !== targetName
        );
        setFavoriteNameList(newFavoriteList);
      }
    };
  
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-4 lg:gap-x-6">
        {pokemonData.map((data) => (
          <PokemonCardComponent
            data={data}
            isFavorite={favoriteNameList.includes(data.name)}
            handleFavorite={handleFavorite}
            key={`${data.name}-pokemonCard-home`}
          />
        ))}
      </div>
    );
  };

export default PokemonCardList