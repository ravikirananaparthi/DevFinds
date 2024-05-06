import React, { useContext, useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { FaRegBell, FaUserCircle } from "react-icons/fa";
import { Context, auth, server } from "../main";
import toast from "react-hot-toast";
import axios from "axios"; // Import axios for making HTTP requests
import { Link, Navigate } from "react-router-dom";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import logo from '../assets/logo2.png';
import { signOut } from "firebase/auth";

const Navbar = (props) => {
  const { user, isAuthenticated, setAuth, loader, setLoader } =
    useContext(Context);
  const [isOpen, setIsOpen] = useState(false);

  const logOutHandler = async () => {
    setLoader(true);
    try {
      await signOut(auth);
      const response = await axios.get(`${server}users/logout`, {
        withCredentials: true,
      });
  
      toast.success('Logged Out Successfully');
      setAuth(false);
      localStorage.removeItem('token');
      axios.defaults.headers.common['Authorization'] = '';

    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed'); // Handle potential errors
    } finally {
      setLoader(false);
    }
  };
  

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-700 p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between ">
        <div className="flex items-center bg-transparent font-cinzel text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white">
      <Link to={"/app/viewposts"}>
        Dev Finds
      </Link>
    </div>

          <label className="md:hidden btn btn-circle swap swap-rotate bg-gray-700 hover:bg-black border-none text-white">
            {/* this hidden checkbox controls the state */}
            <input type="checkbox" onClick={toggleMenu} />

            {/* hamburger icon */}
            <svg
              className="swap-off fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 512 512"
            >
              <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </svg>

            {/* close icon */}
            <svg
              className="swap-on fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 512 512"
            >
              <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
            </svg>
          </label>
          <div className="hidden md:flex justify-between items-center space-x-10">
            {isAuthenticated && (
              <>
                <Link to="/app/viewposts">
                  <button className="text-white hover:bg-gradient-to-r hover:from-amber-200 hover:to-yellow-500 rounded px-4 py-2 hover:text-black transition duration-300">
                    Home
                  </button>
                </Link>
                <Link to={"/app/notifications"}>
                  <button className="text-amber-600 hover:bg-gradient-to-r hover:from-amber-200 hover:to-yellow-500 hover:text-white flex items-center rounded-full p-2">
                    <FaRegBell size={20} />
                  </button>
                </Link>
                <Link to="/app/message">
                  <button className="text-white hover:bg-gradient-to-r hover:from-amber-200 hover:to-yellow-500 rounded px-4 py-2 hover:text-black  transition duration-300">
                    <BiSolidMessageSquareDetail size={30} />
                  </button>
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <Link to={'/'}>
              <button
                onClick={logOutHandler}
                className="bg-gradient-to-r from-amber-200 to-yellow-500 text-black rounded-md px-4 py-2 transition duration-300 ease-in-out hover:from-amber-100 hover:to-yellow-300"
              >
                Logout
              </button>
              </Link>
            ) : (
              <Link to={"/app/login"}>
                <button className="bg-gradient-to-r from-amber-200 to-yellow-500 text-black rounded-md px-4 py-2 transition duration-300 ease-in-out hover:from-amber-200 hover:to-yellow-500">
                  Login
                </button>
              </Link>
            )}

            {isAuthenticated && (
              <Link to="/app/profile" className="">
                {user.image ? (
                  <img
                    src={user.image}
                    className="rounded-full object-cover "
                    alt="User Profile"
                    style={{ width: "40px", height: "40px" }}
                  />
                ) : (
                  <FaUserCircle className="icon" size={40} />
                )}
              </Link>
            )}
          </div>
        </div>
        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden transition duration-300">
            <div className="flex flex-col items-center mt-4 space-y-5">
              <Link to="/app/viewposts">
                <button className="text-white">Home</button>
              </Link>
              <Link to="/app/profile" className="nav-profile flex flex-row">
                {user.image ? (
                  <img
                    src={user.image}
                    className="rounded-full object-cover"
                    alt="User Profile"
                    style={{ width: "40px", height: "40px" }}
                  />
                ) : (
                  <FaUserCircle size={25} className="mt-3" />
                )}
                <span className="text-white m-3">My Profile</span>
              </Link>
              <Link to="/app/notifications">
                <button className="text-white flex items-center">
                  <FaRegBell /> <span className="ml-1">Notifications</span>
                </button>
              </Link>
              <Link to="/app/message">
                <button className="text-white">Messages</button>
              </Link>

              {isAuthenticated && (
                <button
                  onClick={logOutHandler}
                  className="bg-lime-400 hover:bg-lime-500 text-gray-900 rounded-md px-4 py-2 transition duration-300 ease-in-out"
                >
                  Logout
                </button>
              )}
              {!isAuthenticated && (
                <Link to={"/app/login"}>
                  <button className="bg-lime-400 hover:bg-lime-500 text-gray-900 rounded-md px-4 py-2 transition duration-300 ease-in-out">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;