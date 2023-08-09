import React from "react";
import { useNavigate } from "react-router-dom";
import FloatingActionButton from "../component/FloatingActionButton";
import HightlightPokemon from "../component/homepage/HightlightPokemon";
import PokemonCardScrollable from "../component/homepage/PokemonCardScrollable";

function HomePage() {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-2xl py-1 px-4 sm:py-8 sm:px-6 md:max-w-4xl md:px-6 md:py-6 lg:max-w-7xl lg:px-8 md:py-6">
        <HightlightPokemon/>
        <PokemonCardScrollable/>
        <FloatingActionButton
          handleClickHome={scrollToTop}
          handleClickFavorite={() => navigate("/favorite")}
          totalFavorited={100} //change to a number
        />
      </div>
    </div>
  );
}

export default HomePage;
