import React from "react";
import { IoSearch } from "react-icons/io5";
import { TbTrendingUp3 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleNewPostClick = () => {
    navigate("/posts");
  };

  return (
    <div className="flex flex-col items-center backdrop-blur-lg">
      <div className="bg-white rounded-full flex ml-16 mt-3 items-center px-2 w-[250px] md:w-[300px] lg:w-[350px]">
        <input
          type="text"
          placeholder="search"
          className="w-full py-2 bg-transparent cursor-pointer focus:outline-none"
        ></input>
        <IoSearch size={25} className="cursor-pointer" />
      </div>
      <div className="p-4">
        <p className="flex items-center mb-2">
          <TbTrendingUp3 size={25} className="mr-2" />
          Amazon
        </p>
        <p className="flex items-center mb-2">
          <TbTrendingUp3 size={25} className="mr-2" />
          Flipkart
        </p>
        <p className="flex items-center mb-2">
          <TbTrendingUp3 size={25} className="mr-2" />
          Netflix
        </p>
        <p className="flex items-center mb-2">
          <TbTrendingUp3 size={25} className="mr-2" />
          NodeJs
        </p>
      </div>
      <footer className="mt-auto">
        <button
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          onClick={handleNewPostClick}
        >
          + Post
        </button>
      </footer>
    </div>
  );
}

export default Sidebar;
