import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import FavoriteList from "./pages/FavoriteList";
import PokemonDetail from "./pages/PokemonDetail";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route Component={HomePage} path="/" />
          <Route Component={FavoriteList} path="/favorite" />
          <Route Component={PokemonDetail} path="/pokemon/:name" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
