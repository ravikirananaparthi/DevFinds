import React, { useState, useEffect, useContext } from "react";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import { Context, server } from "../main";
import { FaUserCircle } from "react-icons/fa";
import Avatar from "@mui/material/Avatar";
import { FaRegCircleCheck } from "react-icons/fa6";

function Share({ post, onClose }) {
  const { user } = useContext(Context);
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const cid = user._id; // State for search query

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`${server}users/friendslist`, {
          withCredentials: true,
        });
        const initialFilteredFriends = response.data.friends.map((friend) => ({
          ...friend,
          sent: false, // Add sent property to track if the post has been sent
        }));
        setFriends(initialFilteredFriends);
        setFilteredFriends(initialFilteredFriends);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    const filtered = friends.filter((friend) =>
      friend.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredFriends(filtered);
  };

  const handlePopupClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  const sendPostToFriend = async (friendId, post, index) => {
    console.log(friendId, post);
    try {
      const response = await axios.post(`${server}message/addmsg`, {
        from: cid,
        to: friendId,
        message: post,
        messageType: 'post',
      }, {
        withCredentials: true, // Move the withCredentials to the correct parameter
      });

      console.log('Post shared successfully:', response.data);
      const updatedFriends = [...filteredFriends];
      updatedFriends[index].sent = true; // Mark the friend as sent
      setFilteredFriends(updatedFriends);
      // You can add logic here to handle successful sharing of the post
    } catch (error) {
      console.error("Error sharing post:", error);
      // You can add logic to handle errors
    }
  };

  return (
    <div className="fixed bottom-0  md:h-lhv  md:left-[360px] lg:left-[650px] lg:top-[200px] bg-gray-700 backdrop-blur-lg  rounded-t-3xl shadow-lg p-4 transition-transform transform translate-y-0 w-full md:w-[25rem] xl:w-[33.25rem]  h-[550px]  max-h-full md:h-[40rem] ">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Share with Friends</h2>
        <button
          onClick={(e) => handlePopupClose(e)}
          className="text-white hover:text-red-500 focus:outline-none rounded-full hover:bg-slate-600 p-3"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
      <div className="flex justify-center items-center">
      <div className="bg-white rounded-full flex justify-center items-center mb-4 w-[20rem] m-3 px-2">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full py-2 px-3 bg-transparent cursor-pointer text-black focus:outline-none"
        />
        <IoSearch size={25} className="cursor-pointer" />
      </div>
      </div>
      <div className="overflow-y-auto max-h-[400px] pb-20 ">
        {/* List of friends */}
        {filteredFriends.map((friend, index) => (
          <div
            key={friend._id} // Assuming each friend has a unique ID
            className="flex items-center py-2  cursor-pointer"
          >
            {friend.image ? (
              <Avatar alt={friend.name} src={friend.image} className="mr-2" />
            ) : (
              <FaUserCircle className="w-10 h-10 text-blue-400 mr-2" />
            )}
            <span className="text-white">{friend.name}</span>
            <button
              className={`text-white px-9 py-1 rounded-md ml-auto mr-7  ${friend.sent ? 'bg-green-500 px-[2.5rem]' : 'bg-blue-500'} ${friend.sent ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => sendPostToFriend(friend._id, post, index)}
              disabled={friend.sent}
            >
              {friend.sent ? <FaRegCircleCheck size={24}/>:'send'}
            </button>
          </div>
        ))}
      </div>
      <div className="h-20 md:h-0"></div>
    </div>
  );
}

export default Share;


