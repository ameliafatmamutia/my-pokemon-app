import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PokemonCardList from "./PokemonCardList";
import { useInfiniteQuery } from "react-query";
import LoadingSkeletonCard from "../loader/LoadingSkeletonCard";

function PokemonCardScrollable() {
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

  const { data, fetchNextPage, hasNextPage, isError } =
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

  return (
    <div>
      <p className="text-black text-2xl font-bold mt-8 mb-2">Pokemons</p>
      <InfiniteScroll
        dataLength={data?.pages.flatMap((page) => page.results).length + 1 || 0}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<LoadingSkeletonCard />}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <PokemonCardList
          pokemonData={data?.pages.flatMap((page) => page.results) || []}
        />
      </InfiniteScroll>
    </div>
  );
}

export default PokemonCardScrollable;
