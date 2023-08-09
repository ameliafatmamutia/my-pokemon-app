import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { InformationCircleIcon, HeartIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import { db } from "../utils/firebase";
import FloatingActionButton from "../component/floatingButton";
import SkeletonLoadingCard from "../component/cardSquareLoading";
import { capitalCase } from "change-case";
import CarouselList from "../component/carouselList";
import CardIndividualPokemon from "../component/cardIndividualPokemon";
import { generateRandomNumbers } from "../utils/randomArrayNumber";
import SkeletonLoadingDetail from "../component/cardDetailLoading";

const LoadingSkeletonCard = () => {
  const numberOfCards = 12;

  const cards = [];
  for (let i = 0; i < numberOfCards; i++) {
    cards.push(<SkeletonLoadingCard key={`${i}-skeleton-loading-card`} />);
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-4 lg:gap-x-6 mt-4">
      {cards}
    </div>
  );
};

const CardComponent = ({ data, isFavorite }) => {
  const navigate = useNavigate();
  const [tempIsFavorite, setTempIsFavorite] = useState(false);
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
      setTempIsFavorite(true);
    }
    if (type === "dislike") {
      await setDoc(docRef, {
        favoriteName: favoriteName.filter((nameData) => nameData !== data.name),
        favoriteCount: favoriteCount - 1,
      });
      setTempIsFavorite(false);
    }
  };

  useEffect(() => {
    if (isFavorite) {
      setTempIsFavorite(isFavorite);
    }
  }, [isFavorite]);

  return (
    <div className="flex flex-col items-center p-4 rounded bg-customCard rounded-xl">
      <img src={data.image} alt={data.name} className="w-32 h-32 mb-4" />
      <p className="text-lg font-semibold mb-2 text-white">
        {capitalCase(data.name || "")}
      </p>

      <div className="flex items-center">
        <div className="bg-customButton rounded-full">
          <button className="p-2 rounded-md">
            <HeartIcon
              onClick={() => {
                tempIsFavorite ? updateDoc("dislike") : updateDoc("like");
              }}
              className={`w-6 h-6 ${
                tempIsFavorite ? "text-red-500" : "text-white"
              } hover:text-red-300 hover:cursor-pointer`}
            />
          </button>
          <button className="p-2 rounded-md">
            <InformationCircleIcon
              className="w-6 h-6 text-white hover:text-blue-300"
              onClick={() => navigate(`/pokemon/${data.name}`)}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

const PokemonList = ({ pokemonData }) => {
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
        <CardComponent
          data={data}
          isFavorite={favoriteNameList.includes(data.name)}
          handleFavorite={handleFavorite}
          key={`${data.name}-${index}`}
        />
      ))}
    </div>
  );
};

function HomePage() {
  const navigate = useNavigate();
  const [highlightedPokemon, setHighlightedPokemon] = useState([]);
  const [isLoadingHightlight, setIsLoadingHightlight] = useState(false)
  const [favoriteNameList, setFavoriteNameList] = useState([]);

  const fetchFavorite = async () => {
    const docRef = doc(db, "pokedex", "favoriteList");
    const docSnap = await getDoc(docRef);

    const favoriteName = docSnap.data().favoriteName;
    setFavoriteNameList(favoriteName);
  };

  const getPokemons = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/?offset=${
        (pageParam - 1) * 20
      }&limit=20`
    );
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }
    const data = await res.json();
    const dataWithImage = await Promise.all(
      data?.results.map(async (element) => {
        const resIndividual = await fetch(element.url);
        const jsoner = await resIndividual.json();
        return {
          ...element,
          image:
            jsoner.sprites.other.dream_world.front_default ||
            jsoner.sprites.other.home.front_default ||
            jsoner.sprites.other["official-artwork"].front_default,
        };
      })
    );
    return { ...data, results: dataWithImage };
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError } =
    useInfiniteQuery("pokemon", getPokemons, {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.next) {
          const url = new URL(lastPage.next);
          const pageParam = url.searchParams.get("offset") / 20 + 1;
          return pageParam;
        }
        return undefined;
      },
    });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      const newFavoriteName = [...favoriteName, name]
      await setDoc(docRef, {
        favoriteName: newFavoriteName,
        favoriteCount: favoriteCount + 1,
      });
      setFavoriteNameList(newFavoriteName)
    }
    if (type === "dislike") {
      const newFavoriteName = favoriteName.filter((data) => data !== name)
      await setDoc(docRef, {
        favoriteName: newFavoriteName,
        favoriteCount: favoriteCount - 1,
      });
      setFavoriteNameList(newFavoriteName)
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
    setIsLoadingHightlight(false)
  };

  useEffect(() => {
    setIsLoadingHightlight(true)
    fetchFavorite();
    fetchRandomPokemon();
  }, []);
  if (isError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-2xl py-1 px-4 sm:py-8 sm:px-6 md:max-w-4xl md:px-6 md:py-6 lg:max-w-7xl lg:px-8 md:py-6">
        <p className="text-black text-2xl font-bold">Highlight : </p>
        {isLoadingHightlight ? <SkeletonLoadingDetail/> : (
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
        
        <p className="text-black text-2xl font-bold p-4 mb-8">Pokemons</p>
        <InfiniteScroll
          dataLength={
            data?.pages.flatMap((page) => page.results).length + 1 || 0
          }
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          <PokemonList
            pokemonData={data?.pages.flatMap((page) => page.results) || []}
          />
          {isFetchingNextPage && <LoadingSkeletonCard />}
        </InfiniteScroll>
        <FloatingActionButton
          handleClickHome={scrollToTop}
          handleClickFavorite={() => navigate("/favorite")}
        />
      </div>
    </div>
  );
}

export default HomePage;
