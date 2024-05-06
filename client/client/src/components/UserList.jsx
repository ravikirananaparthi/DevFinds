import React, { useContext, useState } from "react";
import { FaUserCircle, FaUserCheck, FaAngleDoubleDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Context } from "../main";
import axios from "axios";
import { RiUserReceivedFill } from "react-icons/ri";
import { server } from "../main";
const UserList = ({ users }) => {
  const { user } = useContext(Context);
  const [requestSent, setRequestSent] = useState({});
  const [fetchUsers, setFetchUsers] = useState(false);
  const { t } = useContext(Context);
  const sendFriendRequest = async (userId) => {
    try {
      await axios.post(
        `${server}users/friendrequest`,
        { requestTo: userId },
        { withCredentials: true }
      );
      // Set the requestSent state for the user whose request has been sent
      setRequestSent((prevRequests) => ({
        ...prevRequests,
        [userId]: true,
      }));
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  return (
    <div
      className=" p-4 rounded-xl shadow-md mb-4  "
      data-theme={t.includes("light") ? "light" : "night"}
    >
      <h1 className="text-2xl font-bold mb-4 ">Users</h1>
      <button
        className="text-blue-500 cursor-pointer flex items-center"
        onClick={() => setFetchUsers(!fetchUsers)}
      >
        <FaAngleDoubleDown
          className={`mr-1 ${fetchUsers ? "rotate-180" : ""}`}
        />
        Fetched Users
      </button>
      {fetchUsers === true ? (
        <div className="grid grid-cols-1 gap-4">
          {users.map((userItem) => (
            <div
              key={userItem._id}
              className="flex items-center border-b py-2 hover:bg-gray-500 relative"
            >
              {userItem.image ? (
                <img
                  src={userItem.image}
                  alt={userItem.name}
                  className="h-10 w-10 rounded-full object-cover mr-2"
                />
              ) : (
                <FaUserCircle size={50} className="h-10 w-10  mr-2" />
              )}

              <Link
                to={`/app/userprofile/${userItem._id}`}
                className=" font-semibold cursor-pointer"
              >
                {userItem.name}
              </Link>
              {userItem._id !== user._id && (
                <div className="ml-auto flex items-center">
                  {userItem.status === "Friends already" && (
                    <>
                      <FaUserCheck className="text-green-500 mr-1" />
                      <span className="text-green-500">Friends already</span>
                    </>
                  )}
                  {userItem.status === "Request already sent" && (
                    <>
                      <RiUserReceivedFill className="text-blue-500 mr-1" />
                      <span className="text-blue-500">
                        Request already sent
                      </span>
                    </>
                  )}
                  {userItem.status === "" && !requestSent[userItem._id] && (
                    <button
                      onClick={() => sendFriendRequest(userItem._id)}
                      className="bg-blue-500  px-4 py-2 rounded-md ml-2"
                    >
                      Send Request
                    </button>
                  )}
                  {requestSent[userItem._id] && (
                    <button
                      className="bg-blue-500  px-4 py-2 rounded-md ml-2 flex items-center"
                      disabled
                    >
                      <RiUserReceivedFill className="mr-1" />
                      Request Sent
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default UserList;
