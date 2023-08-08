import React from "react";
import Navbar from "../component/navbar";
import { useInfiniteQuery } from "react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { EyeIcon, HeartIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const CardComponent = ({ data }) => {
    const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center p-4 rounded bg-customCard rounded-xl">
      <img src={data.image} alt={data.name} className="w-32 h-32 mb-4" />
      <p className="text-lg font-semibold mb-2 text-white">{data.name}</p>

      <div className="flex items-center">
        <div className="bg-customButton rounded-full">
          <button className="p-2 rounded-md">
            <HeartIcon className="w-6 h-6 text-white" />
          </button>
          <button className="p-2 rounded-md">
            <EyeIcon className="w-6 h-6 text-white hover:text-blue-300" onClick={() => navigate(`/pokemon/${data.name}`)}/>
          </button>
        </div>
      </div>
    </div>
  );
};

const PokemonList = ({ pokemonData }) => {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-4 lg:gap-x-6">
      {pokemonData.map((data, index) => (
        <CardComponent data={data} />
      ))}
    </div>
  );
};

function HomePage() {
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
          image: jsoner.sprites.other.dream_world.front_default,
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

  if (isError) {
    return <div>Error loading data</div>;
  }

  console.log(data?.pages);

  return (
    <div className="bg-cyan-200 min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-2xl py-1 px-4 sm:py-8 sm:px-6 md:max-w-4xl md:px-6 md:py-6 lg:max-w-7xl lg:px-8 md:py-6">
        <h1>Pokemon List</h1>
        <InfiniteScroll
          dataLength={
            data?.pages.flatMap((page) => page.results).length + 1 || 0
          } //This is important field to render the next data
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
        </InfiniteScroll>

        {hasNextPage && (
          <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </button>
        )}
      </div>
    </div>
  );
}

export default HomePage;
