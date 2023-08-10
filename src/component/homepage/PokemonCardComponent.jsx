import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { capitalCase } from "change-case";
import { HeartIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import pokeball from "../../assets/images/pokeball.png";
import { useDispatch } from "react-redux";
import { updateCount } from "../../utils/redux/favoriteSlice";

const PokemonCardComponent = ({ data, isFavorite }) => {
  const navigate = useNavigate();
  const [tempIsFavorite, setTempIsFavorite] = useState(false);
  const dispatch = useDispatch();
  const updateDoc = async (type) => {
    const docRef = doc(db, "pokedex", "favoriteList");
    const docSnap = await getDoc(docRef);
    let favoriteName = docSnap.data().favoriteName;
    const favoriteCount = docSnap.data().favoriteCount;

    if (type === "like") {
      await setDoc(docRef, {
        favoriteName: [...favoriteName, data.name],
        favoriteCount: favoriteCount + 1,
      });
      dispatch(updateCount(favoriteCount + 1));
      setTempIsFavorite(true);
    }
    if (type === "dislike") {
      await setDoc(docRef, {
        favoriteName: favoriteName.filter((nameData) => nameData !== data.name),
        favoriteCount: favoriteCount - 1,
      });
      dispatch(updateCount(favoriteCount - 1));
      setTempIsFavorite(false);
    }
  };

  useEffect(() => {
    if (isFavorite) {
      setTempIsFavorite(isFavorite);
    }
  }, [isFavorite]);

  return (
    <div className="flex flex-col items-center p-4 bg-customCard rounded-xl">
      <img
        src={data.image || pokeball}
        alt={data.name}
        className="w-20 h-20 mb-4"
      />
      <p className="text-[12px] font-semibold mb-2 text-white">
        {capitalCase(data.name || "")}
      </p>

      <div className="flex items-center">
        <div className="bg-customButton rounded-full px-5">
          <button className="p-1 rounded-md">
            <HeartIcon
              onClick={() => {
                tempIsFavorite ? updateDoc("dislike") : updateDoc("like");
              }}
              className={`w-4 h-4 ${
                tempIsFavorite ? "text-red-500" : "text-white"
              } hover:cursor-pointer`}
            />
          </button>
          <button className="p-1 rounded-md">
            <InformationCircleIcon
              className="w-4 h-4 text-white"
              onClick={() => navigate(`/pokemon/${data.name}`)}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PokemonCardComponent;
