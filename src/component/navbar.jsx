import React from 'react';
import { TrashIcon } from '@heroicons/react/24/solid'
const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="hidden md:flex items-center">
          <TrashIcon className="h-6 w-6 text-white mr-2" />
          <span className="text-white font-semibold">My App</span>
        </div>
        <div className="md:hidden flex items-center justify-center w-full">
          <TrashIcon className="h-6 w-6 text-white" />
          <span className="text-white font-semibold">Mobile mode</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
