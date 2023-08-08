import React from "react";
import Navbar from "../component/navbar";
import { useInfiniteQuery } from "react-query";



const PokemonList = ({ pokemon }) => {
    return (
      <ul>
        {pokemon.map((p) => (
          <li key={p.name}>{p.name}</li>
        ))}
      </ul>
    );
  };
  

function HomePage() {
    const getPokemons = async ({ pageParam = 1 }) => {
        console.log(pageParam);
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${(pageParam - 1) * 10}&limit=10`)
        if (!res.ok) {
          // This will activate the closest `error.js` Error Boundary
          throw new Error('Failed to fetch data')
        }
        const data = await res.json()
        console.log(data, 'the data');
        return data
      }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery(
    'pokemon',
    getPokemons,
    {
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.next) {
                const url = new URL(lastPage.next);
                const pageParam = url.searchParams.get('offset') / 10 + 1;
                return pageParam;
              }
              return undefined;
        }
    }
  );

  console.log(data, 'data all');

  if (isError) {
    return <div>Error loading data</div>;
  }

  return (
    <div>
        <Navbar/>
      <h1>Pokemon List</h1>
      <PokemonList pokemon={data?.pages.flatMap((page) => page.results) || []} />

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load More'}
        </button>
      )}
    </div>
  );
}

export default HomePage;
