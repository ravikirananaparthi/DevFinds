import React, { useContext, useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { FaRegBell, FaUserCircle } from "react-icons/fa";
import { Context, server } from "../main";
import toast from "react-hot-toast";
import axios from "axios"; // Import axios for making HTTP requests
import { Link, Navigate } from "react-router-dom";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import logoImage from "../assets/devlogooooo.png";
import Image from "../assets/logo.png";
import { TiHome } from "react-icons/ti";
import { FaRegMessage } from "react-icons/fa6";

const Navbar = (props) => {
  const { user, isAuthenticated, setAuth, loader, setLoader, t, st } =
    useContext(Context);
  const [isOpen, setIsOpen] = useState(false);

  const logOutHandler = async () => {
    setLoader(true);
    try {
      await axios.get(`${server}users/logout`, {
        withCredentials: true,
      });
      toast.success("Logged Out Successfully");
      setAuth(false);
      localStorage.removeItem("token");
      axios.defaults.headers.common["Authorization"] = "";
      setLoader(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setAuth(false);
      setLoader(false);
    }
  };
  const handleTheme = () => {
    if (t === "light") {
      st("dark");
    } else {
      st("light");
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-gradient-to-r from-guv/60 to-jagaur/90 bg-opacity-30 backdrop-filter backdrop-blur-lg p-3">
      <div className="mx-auto">
        <div className="flex items-center justify-start md:justify-between">
          <label className="md:hidden btn btn-circle swap swap-rotate bg-gray-700/10 hover:bg-black/10 border-none text-white z-20">
            {/* this hidden checkbox controls the state */}
            <input type="checkbox" onClick={toggleMenu} />

            {/* hamburger icon */}
            <svg
              className="swap-off fill-current z-20"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 512 512"
            >
              <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </svg>

            {/* close icon */}
            <svg
              className="swap-on fill-current z-20" 
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 512 512"
            >
              <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
            </svg>
          </label>
          <div className="flex items-center ml-3">
            <Link to={"/app/viewposts"}>
              <img
                src={logoImage}
                alt="Logo"
                className="h-7 w-[170px] md:h-8 md:w-[200px] object-cover"
              />
            </Link>
          </div>
          <label className="md:hidden swap swap-rotate ml-10">
              {/* this hidden checkbox controls the state */}
              <input
                type="checkbox"
                className="theme-controller"
                value="synthwave"
                onClick={handleTheme}
              />
              <svg
                className="swap-off fill-current w-8 h-8 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
              <svg
                className="swap-on fill-current w-8 h-8 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>

              {/* moon icon */}
            </label>
          <div className="hidden md:flex justify-between items-center space-x-10 ">
            <label className="swap swap-rotate ">
              {/* this hidden checkbox controls the state */}
              <input
                type="checkbox"
                className="theme-controller"
                value="synthwave"
                onClick={handleTheme}
              />
              <svg
                className="swap-off fill-current w-8 h-8 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
              <svg
                className="swap-on fill-current w-8 h-8 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>

              {/* moon icon */}
            </label>
            {isAuthenticated && (
              <>
                <Link to="/app/viewposts">
                  <button class="relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                    <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Home
                    </span>
                  </button>
                </Link>

                <Link to={"/app/notifications"}>
                  <button class="relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                    <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      <FaRegBell size={20} />
                    </span>
                  </button>
                </Link>
                <Link to="/app/message">
                  <button class="relative inline-flex items-center justify-center p-0.5 mb me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                    <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      <BiSolidMessageSquareDetail size={20} />
                    </span>
                  </button>
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <>
                <button
                  class="relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-500 to-orange-400 group-hover:from-red-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-red-200 dark:focus:ring-red-800"
                  onClick={logOutHandler}
                >
                  <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    Logout
                  </span>
                </button>
              </>
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
                    className="rounded-full object-cover   transition-opacity duration-100 hover:opacity-40"
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
        {/*large screens*/}

        {/* Mobile menu */}

        <div
          className={`md:hidden fixed right-0 top-0 bottom-0 h-screen w-[300px] bg-black border-b transition-transform duration-400 ${
            isOpen ? "transform translate-x-0" : "transform translate-x-full"
          }`}
        >
          <img src={Image} alt="Logo" className="object-cover" />
          <div className="flex flex-col items-center space-y-5">
            <Link to="/app/viewposts" onClick={closeSidebar} className="mr-7">
              <button className="text-white flex items-center">
                <TiHome size={25} /> <span className="ml-1">Home</span>
              </button>
            </Link>
            <Link
              to="/app/profile"
              className="nav-profile flex flex-row"
              onClick={closeSidebar}
            >
              {user.image ? (
                <img
                  src={user.image}
                  className="rounded-full object-cover  transition-opacity duration-100 hover:opacity-40"
                  alt="User Profile"
                  style={{ width: "40px", height: "40px" }}
                />
              ) : (
                <FaUserCircle size={25} />
              )}
              <span className="text-white ml-1">My Profile</span>
            </Link>
            <Link
              to="/app/notifications"
              onClick={closeSidebar}
              className="ml-4"
            >
              <button className="text-white flex items-center">
                <FaRegBell size={23} />{" "}
                <span className="ml-1">Notifications</span>
              </button>
            </Link>
            <Link to="/app/message" onClick={closeSidebar} className="">
              <button className="text-white flex items-center">
                <FaRegMessage size={20} />
                <span className="ml-1">Messages</span>
              </button>
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
              <Link to={"/app/login"} onClick={closeSidebar}>
                <button className="bg-lime-400 hover:bg-lime-500 text-gray-900 rounded-md px-4 py-2 transition duration-300 ease-in-out">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
