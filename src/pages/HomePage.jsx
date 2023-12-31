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
    <div className="bg-slate-100 min-h-screen">
      <div className="mx-auto max-w-2xl py-5 px-6 sm:py-8 sm:px-6 md:max-w-4xl md:px-6 lg:max-w-7xl lg:px-8 md:py-6">
        <HightlightPokemon/>
        <PokemonCardScrollable/>
        <FloatingActionButton
          handleClickHome={scrollToTop}
          handleClickFavorite={() => navigate("/favorite")}
        />
      </div>
    </div>
  );
}

export default HomePage;
