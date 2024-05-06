import React from "react";
import { IoSearch, IoTrendingUp } from "react-icons/io5";
import { RiFireFill } from "react-icons/ri";
import { FaHistory, FaShare } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { GoComment } from "react-icons/go";

const Proske = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen  bg-gradient-to-r from-[#4b6cb7] to-[#182848]">
      <div className="container p-4 mx-auto md:p-8 ">
        <div className="grid gap-4 md:grid-cols-3 ">
          <div className="md:col-span-1 h-auto md:h-[5in] lg:max-h-[5in] flex flex-col items-center backdrop-blur-lg bg-gray-700 rounded-xl sm:sticky mt-16"></div>

          <div className="p-4 rounded-xl shadow md:col-span-2  ">
            <h1 className="mb-4 text-2xl font-bold text-black">Posts page</h1>
            <div className="grid grid-cols-1 gap-4 text-sm md:text-xl mb-5">
              <div className=" p-6 rounded-xl shadow-xl cursor-pointer bg-white ">
                <div className="flex items-center mb-2">
                  <div className="h-14 w-14 mr-2 skeleton rounded-full shrink-0 bg-gray-300"></div>
                  <div className="flex flex-col gap-4 b">
                    <div className="skeleton h-4 w-56 bg-gray-300"></div>
                    <div className="skeleton h-4 lg:w-96 md:w-72 sm:56 bg-gray-300"></div>
                  </div>
                </div>
                <h2 className="text-lg font-semibold mb-2 text-black  skeleton bg-gray-300"></h2>
                <p className="text-gray-600 mb-4 skeleton"></p>

                <div className="skeleton w-full h-52  object-cover my-3 rounded-lg bg-gray-300"></div>

                <div className="flex items-center justify-around">
                  <div className="flex items-center">
                    <CiHeart size={20} className="cursor-pointer mr-2" />
                    <p className="text-gray-500 skeleton bg-gray-300"></p>
                  </div>
                  <div className="flex items-center">
                    <GoComment
                      size={20}
                      className="text-blue-500 cursor-pointer hover:text-green-500 mr-2"
                    />
                    <p className="text-gray-500 skeleton bg-gray-300"></p>
                  </div>
                  <FaShare size={20} className="text-blue-500 cursor-pointer" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 text-sm md:text-xl mb-5">
              <div className=" p-6 rounded-xl shadow-xl cursor-pointer bg-white ">
                <div className="flex items-center mb-2">
                  <div className="h-14 w-14 mr-2 skeleton rounded-full shrink-0 bg-gray-300"></div>
                  <div className="flex flex-col gap-4 b">
                    <div className="skeleton h-4 w-56 bg-gray-300"></div>
                    <div className="skeleton h-4 lg:w-96 md:w-72 sm:56 bg-gray-300"></div>
                  </div>
                </div>
                <h2 className="text-lg font-semibold mb-2 text-black  skeleton bg-gray-300"></h2>
                <p className="text-gray-600 mb-4 skeleton"></p>

                <div className="skeleton w-full h-52  object-cover my-3 rounded-lg bg-gray-300"></div>

                <div className="flex items-center justify-around">
                  <div className="flex items-center">
                    <CiHeart size={20} className="cursor-pointer mr-2" />
                    <p className="text-gray-500 skeleton bg-gray-300"></p>
                  </div>
                  <div className="flex items-center">
                    <GoComment
                      size={20}
                      className="text-blue-500 cursor-pointer hover:text-green-500 mr-2"
                    />
                    <p className="text-gray-500 skeleton bg-gray-300"></p>
                  </div>
                  <FaShare size={20} className="text-blue-500 cursor-pointer" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 text-sm md:text-xl mb-5 ">
              <div className=" p-6 rounded-xl shadow-xl cursor-pointer bg-white ">
                <div className="flex items-center mb-2">
                  <div className="h-14 w-14 mr-2 skeleton rounded-full shrink-0 bg-gray-300"></div>
                  <div className="flex flex-col gap-4 b">
                    <div className="skeleton h-4 w-56 bg-gray-300"></div>
                    <div className="skeleton h-4 lg:w-96 md:w-72 sm:56 bg-gray-300"></div>
                  </div>
                </div>
                <h2 className="text-lg font-semibold mb-2 text-black  skeleton bg-gray-300"></h2>
                <p className="text-gray-600 mb-4 skeleton"></p>

                <div className="skeleton w-full h-52  object-cover my-3 rounded-lg bg-gray-300"></div>

                <div className="flex items-center justify-around">
                  <div className="flex items-center">
                    <CiHeart size={20} className="cursor-pointer mr-2" />
                    <p className="text-gray-500 skeleton bg-gray-300"></p>
                  </div>
                  <div className="flex items-center">
                    <GoComment
                      size={20}
                      className="text-blue-500 cursor-pointer hover:text-green-500 mr-2"
                    />
                    <p className="text-gray-500 skeleton bg-gray-300"></p>
                  </div>
                  <FaShare size={20} className="text-blue-500 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proske;
