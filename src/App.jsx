import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import FavoriteList from "./pages/FavoriteList";
import PokemonDetail from "./pages/PokemonDetail";
import PageNotFound from "./pages/404";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route Component={HomePage} path="/" />
          <Route Component={FavoriteList} path="/favorite" />
          <Route Component={PokemonDetail} path="/pokemon/:name" />
          <Route Component={PageNotFound} path="*"/>
          <Route Component={PageNotFound} path="/not-found"/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
