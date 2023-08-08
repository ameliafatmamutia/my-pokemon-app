import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../component/navbar';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

function PokemonDetail() {
    const { name } = useParams();
    const navigate = useNavigate()
  return (
    <div className="bg-cyan-200 min-h-screen">
    <Navbar/>
    <div className='flex border-b-2'>
    <ChevronLeftIcon className='h-10 w-10 hover:cursor-pointer' onClick={() => navigate('/')}/>
    <p>{name}</p>
    </div>
   
    </div>


  )
}

export default PokemonDetail