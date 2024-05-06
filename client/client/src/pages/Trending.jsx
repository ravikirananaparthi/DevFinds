import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { GoComment } from "react-icons/go";
import { FaUserCircle, FaShare } from "react-icons/fa";
import { SlGraph } from "react-icons/sl";
import { FcLike } from "react-icons/fc";
import { CiHeart } from "react-icons/ci";
import { RiFireFill } from "react-icons/ri";
import { IoTrendingUp } from "react-icons/io5";
import ReactPlayer from "react-player";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import moment from "moment";
import UserList from "../components/UserList";
import { Context } from "../main";
import { FaHistory } from "react-icons/fa";
import { io } from "socket.io-client";
import Skeletonfeed from "../components/Skeletonfeed";
import { server } from "../main";
import Share from "../components/Share";
import toast from "react-hot-toast";
const ser = "http://localhost:4000";


const Trending = () => {
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sq, ssq] = useState("");
  const [previousQuery, setPreviousQuery] = useState("");
  const [tof, setTof] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();
  const { user, isAuthenticated ,t} = useContext(Context);
  const [postsFetched, setPostsFetched] = useState(false);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sharingpost, sets] = useState([]);
  const [nol, setnol] = useState([]);
  const [posts, setPosts] = useState([]);

  const cid = user._id;

  useEffect(() => {
    // Fetch trending searches
    axios
      .get(`${server}users/trendingsearches`, {
        withCredentials: true,
      })
      .then((response) => {
        setTrendingSearches(response.data.trendingSearchKeys);
      })
      .catch((error) => {
        console.error("Error fetching trending searches:", error);
      });

    // Fetch search history
    axios
      .get(`${server}users/searchhistory`, {
        withCredentials: true,
      })
      .then((response) => {
        setSearchHistory(response.data.reverse());
      })
      .catch((error) => {
        console.error("Error fetching search history:", error);
      });
  }, []);


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${server}users/trendingposts`, {
            withCredentials: true,
          });
        setPosts(response.data);
        setFilteredPosts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();


  }, []);

  const handleEnterPress = (event) => {
    if (event.key === "Enter") {
      // Append '$' to the searchQuery
      const content = searchQuery + "$";
      setSearchQuery(content.slice(0, -1));
      filterPosts(content.slice(0, -1));
      filterUsers(content);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;

    console.log(query);
    setSearchQuery(query);

    ssq(query);
    filterPosts(query);
    // Check if the length of the query is greater than the previous query
    if (query.length > previousQuery.length) {
      filterUsers(query);
    }

    // Update the previousQuery value
    setPreviousQuery(query);
  };

  const filterPosts = (query) => {
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
  };
  const filterUsers = async (query) => {
    try {
      const usersResponse = await axios.get(`${server}users/findusers`, {
        withCredentials: true,
        params: { query },
      });
      const users = usersResponse.data;
      console.log(users);
      setFilteredUsers(users);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleButtonClick = (content) => {
    setSearchQuery(content);
    filterPosts(content);
  };

  const viewPost = async (postId) => {
    navigate(`/app/posts/${postId}`);
  };
  const handleShare = async (post, e) => {
    e.stopPropagation();
    console.log("im clicked");
    sets(post);
    setDrawerOpen(true);
  };
  // Function to extract file name from URL
  const getPostFileName = (url) => {
    const segments = url.split("/");
    const lastSegment = segments[segments.length - 1];
    const fileName = decodeURIComponent(lastSegment.split("?")[0]);
    return fileName;
  };

  const handleClosePopup = () => {
    setDrawerOpen(false);
  };

  if (posts.length === 0) {
    return <Skeletonfeed />;
  }

  console.log(filteredPosts);
  if (!isAuthenticated) return <Navigate to={"/"} />;



  return (
    <div className="">
      <div class="sm:overflow-y-auto md:overflow-y-hidden md:flex flex-col md:flex-row-reverse h-screen ">
        <div class="md:left md:overflow-y-auto md:w-1/3 m-5 md:my-auto ">
          <div className="h-auto md:h-[5in] lg:max-h-[5in] flex flex-col items-center backdrop-blur-lg  rounded-xl sm:sticky mt-20 md:mt-16  bg-gray-700">
            <div className="flex flex-row">
              <div className=" rounded-full flex ml-2 mt-3 items-center md:w-[180px] lg:w-[330px] w-max-full bg-white text-black ">
                <input
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleEnterPress}
                  className="w-full py-2 px-3 bg-transparent cursor-pointer focus:outline-none "
                />
                <IoSearch size={25} className="cursor-pointer" />
              </div>
            </div>

            <div className="flex w-full justify-between">
              {/* Left side for Trending Search */}
              <div className="w-[15rem] ">
                <div className="p-4  ">
                  <div className="flex flex-row">
                    <RiFireFill size={25} className="mr-2 text-orange-500" />
                    <p className="text-sm lg:text-lg text-white">
                      Trending Search
                    </p>
                  </div>
                  {/* Display Trending Search here */}
                  {trendingSearches.map((item, index) => (
                    <p
                      key={index}
                      className="flex items-center mb-2 text-sm lg:text-lg rounded-lg hover:bg-slate-500 text-white"
                    >
                      <IoTrendingUp size={25} className="mr-2" />
                      <button
                        onClick={() => {
                          handleButtonClick(item);
                          filterPosts(item);
                          filterUsers(item);
                        }}
                      >
                        {item}
                      </button>
                    </p>
                  ))}
                </div>
              </div>
              <div className="border-r border-gray-600"></div>

              <div className="w-[15rem]">
                <div className="p-4 ">
                  <div className="flex flex-row">
                    <FaHistory size={25} className="mr-2 text-green-500" />
                    <p className="text-sm md:text-lg text-white ">
                      Search History
                    </p>
                  </div>
                  {/* Display Search History here */}
                  {searchHistory.map((item, index) => (
                    <p
                      key={index}
                      className="flex items-center mb-2 rounded-lg hover:bg-slate-500 px-3 text-white"
                    >
                      <button onClick={() => {
                          handleButtonClick(item);
                          filterPosts(item);
                          filterUsers(item);
                        }}>
                        {item}
                      </button>
                    </p>
                  ))}
                </div>
              </div>
            </div>
            {/* Footer */}
            <footer className=" hidden mt-auto mb-9  justify-center">
              <button
                className="py-2 px-10 md:px-16 lg:px-36 font-bold  bg-blue-500 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none text-white"
                onClick={() => {
                  navigate("/app/posts");
                  setfetch(false);
                }}
              >
                + Post
              </button>
            </footer>
          </div>
        </div>

        <div class="right flex-1 overflow-y-auto md:h-auto ">
          <div className="p-2 md:p-4 rounded-xl m-2 md:m-5 mb-16 md:mb-6 md:mt-20 ">
            <h1 className="mb-4 text-2xl font-bold text-white text-center">
              Trending Posts
            </h1>
            {filteredUsers.length > 0 ? (
              <UserList users={filteredUsers} />
            ) : null}
            <div className="grid grid-cols-1 gap-4 text-sm md:text-xl ">
              {filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className=" p-6 rounded-xl shadow-xl cursor-pointer"
                  onClick={() => viewPost(post._id)}
                  data-theme={t.includes('light') ? 'light' : 'night'}
                >
                  <div className="flex items-center mb-2">
                    {post.user.image ? (
                      <img
                        src={post.user.image}
                        alt={post.user.name}
                        className="h-12 w-12 md:h-12 md:w-12 mr-2 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="h-12 w-12 mr-2" />
                    )}
                    <p className=" text-lg font-semibold">
                      {post.user.name}
                    </p>
                    <p className="text-gray-500 text-sm ml-auto">
                      {moment(post.createdAt).fromNow()}
                    </p>
                  </div>
                  <h2 className="text-lg font-semibold mb-2 ">
                    {post.title}
                  </h2>
                  <p className=" mb-4  text-lg">
                    {post.description}
                  </p>
                  {post.tof == "pic" && post.image && (
                    <div className="aspect-auto w-full mb-4 border border-solid rounded-lg border-gray-400  md:overflow-hidden">
                      <div className="">
                        <img
                          src={post.image}
                          alt="Post Image"
                          className="object-cover mx-auto rounded-lg object-center"
                          width={500}
                          height={215}
                        />
                      </div>
                    </div>
                  )}
                  {post.tof === "vid" && post.image && (
                    <ReactPlayer
                      url={post.image}
                      controls={true}
                      width="100%"
                      height="full"
                      className="mb-4 rounded-lg overflow-hidden"
                      playing={false} // Auto play the video
                      loop={true} // Loop the video
                      muted={true} // Mute the video
                      pip={true} // Picture-in-Picture mode
                      config={{
                        youtube: {
                          playerVars: { showinfo: 1 }, // YouTube player options
                        },
                      }}
                    />
                  )}
                  {(post.tof === "pdf" || post.tof === "doc") && post.image && (
                    <a
                      href={post.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 hover:bg-slate-300 rounded mb-4 "
                    >
                      <img
                        src="https://static-00.iconduck.com/assets.00/folder-icon-512x410-jvths5l6.png"
                        alt="Folder Icon"
                        className="w-6 h-6"
                      />
                      <span>{getPostFileName(post.image)}</span>
                    </a>
                  )}
                  <div className="flex items-center justify-around">
                    <div className="flex items-center">
 
                        <CiHeart
                          onClick={(e) => handleLike(e, post._id)}
                          size={24}
                          className="cursor-pointer mr-2 text-red-500"
                        />
                      <p className="text-gray-500">{post.likesCount} Likes </p>
                    </div>
                    <div className="flex items-center">
                      <GoComment
                        size={20}
                        className="text-blue-500 cursor-pointer hover:text-green-500 mr-2"
                      />
                      <p className="text-gray-500">{post.commentsCount}</p>
                    </div>
                    <FaShare
                      size={20}
                      className="text-blue-500 cursor-pointer hover:text-blue-800"
                      onClick={(e) => handleShare(post, e)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {drawerOpen && <Share onClose={handleClosePopup} post={sharingpost} />}
      </div>
    </div>
  );
};

export default Trending;
