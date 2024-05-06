import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import FriendDM from "../components/FriendDm";
import { io } from "socket.io-client";
import { Context } from "../main";
import { IoSearch } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { server } from "../main";
import Avatar from "@mui/material/Avatar";
import { Navigate } from "react-router-dom";
function Dm() {
  const { user,isAuthenticated } = useContext(Context);
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showFriendsList, setShowFriendsList] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const socket = useRef();
  const ser="https://devfinds-backend.onrender.com";
  
  useEffect(() => {
    if (user) {
      socket.current = io(`${ser}`);
      socket.current.emit("add-user", user._id);
    }
  }, [user]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `${server}users/friendslist`,
          { withCredentials: true }
        );
        setFriends(response.data.friends);
        setFilteredFriends(response.data.friends);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
    setShowFriendsList(false);
  };

  const handleBackToFriends = () => {
    setShowFriendsList(true);
    setSelectedFriend(null);
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    const filtered = friends.filter((friend) =>
      friend.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredFriends(filtered);
  };
  if (!isAuthenticated) return <Navigate to={"/"} />;
  return (
    <div className="flex h-screen mt-16 -z-40">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 p-4 ${
          showFriendsList ? "block" : "hidden"
        } md:block w-full md:w-1/3 overflow-y-auto`}
      >
      <div className="m-4"></div>
        <div className="bg-white rounded-full flex ml-5 mt-3 mb-10 items-center sm:w-full md:w-[190px] md:m-3 lg:w-[350px]  ">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full py-2 px-3 bg-transparent cursor-pointer text-black focus:outline-none"
          />
          <IoSearch size={25} className="cursor-pointer text-black" />
        </div>
        <h2 className="text-xl font-semibold mb-4 text-white">Friends</h2>
        <div className=" h-full">
          <ul>
            {filteredFriends.map((friend) => (
              <li
                key={friend._id}
                className="cursor-pointer mb-2 flex items-center hover:bg-gray-800 rounded-lg px-3 py-2"
                onClick={() => {handleFriendClick(friend);}}
              >
                {friend.image ? (
                  <Avatar alt="h" src={friend.image} className="mr-2"/>
                ) : (
                  <FaUserCircle className="w-10 h-10 text-gray-400 mr-2" />
                )}
                <span className="text-white">{friend.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FriendDM or Empty Space */}
      {selectedFriend && (
        <div className="w-full md:w-2/3">
          <FriendDM
            friend={selectedFriend}
            onBack={handleBackToFriends}
            socket={socket}
          />
        </div>
      )}
    </div>
  );
}

export default Dm;
