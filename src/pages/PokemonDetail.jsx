import React from 'react'
import { useParams } from 'react-router-dom';

function PokemonDetail() {
    const { name } = useParams();
  return (
    <div>{name}</div>
  )
}

export default PokemonDetail