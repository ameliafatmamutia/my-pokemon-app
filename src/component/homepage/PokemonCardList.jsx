import React, { useEffect, useState } from 'react'
import { doc, getDoc } from "firebase/firestore";
import PokemonCardComponent from './PokemonCardComponent';
import { db } from '../../utils/firebase';

const PokemonCardList = ({ pokemonData }) => {
    const [favoriteNameList, setFavoriteNameList] = useState([]);
  
    const fetchFavorite = async () => {
      const docRef = doc(db, "pokedex", "favoriteList");
      const docSnap = await getDoc(docRef);
  
      const favoriteName = docSnap.data().favoriteName;
      setFavoriteNameList(favoriteName);
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
        {pokemonData.map((data, index) => (
          <PokemonCardComponent
            data={data}
            isFavorite={favoriteNameList.includes(data.name)}
            handleFavorite={handleFavorite}
            key={`${data.name}-${index}`}
          />
        ))}
      </div>
    );
  };

export default PokemonCardList