import React from 'react';
import { FaUserCircle, FaShare } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { GoComment } from "react-icons/go";

function SkePostdetail(props) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#4b6cb7] to-[#182848]">
            <div className="max-w-3xl w-full p-8 bg-white rounded-2xl shadow-lg">
                {/* User Info */}
                <div className="flex items-center mb-4">
                    <FaUserCircle className="h-10 w-10 mr-4 animate-pulse" />
                    <div>
                        <div className="h-4 bg-gray-300 rounded-full mb-2 animate-pulse"></div>
                        <div className="h-3 bg-gray-300 rounded-full mb-1 animate-pulse"></div>
                    </div>
                </div>

                {/* Post Title */}
                <div>
                    <div className="h-4 bg-gray-300 rounded-full mb-4 animate-pulse"></div>
                    <div className="h-3 bg-gray-300 rounded-full mb-4 animate-pulse"></div>
                </div>

                {/* Post Description */}
                <div className="h-20 bg-gray-300 rounded-md mb-4 animate-pulse"></div>

                {/* Post Image */}
                <div className="h-80 bg-gray-300 rounded-md mb-4 animate-pulse"></div>

                {/* Interaction Icons */}
                <div className="border-t border-gray-300 pt-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <CiHeart size={24} className="text-gray-500 cursor-pointer mr-2 animate-pulse" />
                        <p className="text-gray-600">0 Likes</p>
                    </div>
                    <div className="flex items-center">
                        <GoComment size={24} className="text-gray-500 cursor-pointer mr-2 animate-pulse" />
                        <p className="text-gray-600">0 Comments</p>
                    </div>
                    <FaShare size={24} className="text-gray-500 cursor-pointer animate-pulse" />
                </div>
            </div>
        </div>
    );
}

export default SkePostdetail;
