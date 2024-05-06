import React, { useState, useEffect, useContext, useRef } from "react";
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
import { Avatar } from "@mui/material";
const ser = "https://devfinds-backend.onrender.com";
import { FaArrowRightLong } from "react-icons/fa6";
const socket = io(`${ser}`, {
  reconnection: true,
});

const Feed = () => {
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sq, ssq] = useState("");
  const [previousQuery, setPreviousQuery] = useState("");
  const [tof, setTof] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();
  const { user, isAuthenticated, posts, setPosts,t } = useContext(Context);
  const [postsFetched, setPostsFetched] = useState(false);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sharingpost, sets] = useState([]);
  const [nol, setnol] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
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

    axios
      .get(`${server}posts/trendingpost`, {
        withCredentials: true, // Include credentials for cross-origin requests
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json", // Set appropriate content type if sending data
        },
      })
      .then((response) => {
        setTrendingPosts(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log("error fetching ");
      });
  }, []);
  const updatePostLikes1 = (updatedPost) => {
    console.log(updatedPost);
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id
          ? { ...post, likes: updatedPost.likes }
          : post
      )
    );
  };

  const updatePostLikes = (updatedPost) => {
    setFilteredPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${server}users/viewposts`, {
          withCredentials: true, // Include credentials in the request
        });

        setPosts(response.data);
        setFilteredPosts(response.data);
        setPostsFetched(true);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    // Fetch posts only if they haven't been fetched before

    fetchPosts();

    // Socket event listeners
    socket.on("add-like", updatePostLikes);
    socket.on("remove-like", updatePostLikes);

    // Clean up socket event listeners
    return () => {
      socket.off("add-like", updatePostLikes);
      socket.off("remove-like", updatePostLikes);
    };
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
  const handleLike = async (e, postId) => {
    e.stopPropagation();
    try {
      const response = await axios.put(
        `${server}posts/like/post/${postId}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const updatedPost = response.data.post;
        updatePostLikes(updatedPost);
        toast.success("Liked post");
      }
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
    }
  };

  const handleUnlike = async (e, postId) => {
    e.stopPropagation();
    try {
      const response = await axios.put(
        `${server}posts/unlike/post/${postId}`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success("Unliked Post");
      const updatedPost = response.data.post;
      updatePostLikes(updatedPost);
    } catch (error) {
      console.error("Error unliking post:", error);
      toast.error("Failed to unlike post");
    }
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
    <div className="bg-gradient-to-r from-[#4b6cb7] to-[#182848]">
      <div class="sm:overflow-y-auto md:overflow-y-hidden md:flex flex-col md:flex-row h-screen bg-gradient-to-r from-[#4b6cb7] to-[#182848]">
        <div class="md:left md:overflow-y-auto md:w-1/4 m-1 md:my-auto ">
          <div className="h-auto md:h-[5in] lg:max-h-[5in] flex flex-col items-center backdrop-blur-lg bg-gray-700 rounded-xl sm:sticky mt-20 md:mt-16  ">
            <div className="flex flex-row">
              <div className="bg-white rounded-full flex ml-2 mt-3 items-center md:w-[180px] lg:w-[330px] w-max-full">
                <input
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleEnterPress}
                  className="w-full py-2 px-3 bg-transparent cursor-pointer focus:outline-none text-black"
                />
                <IoSearch size={25} className="cursor-pointer text-black" />
              </div>
            </div>

            <div className="flex w-full justify-between">
              {/* Left side for Trending Search */}
              <div className="w-[15rem] ">
                <div className="p-4 text-white ">
                  <div className="flex flex-row">
                    <RiFireFill size={25} className="mr-2 text-orange-500" />
                    <p className="text-sm lg:text-base text-white ">
                      Trending Search
                    </p>
                  </div>
                  {/* Display Trending Search here */}
                  {trendingSearches.map((item, index) => (
                    <p
                      key={index}
                      className="flex items-center mb-2 text-sm lg:text-base rounded-lg hover:bg-slate-500"
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
                <div className="p-4 text-white">
                  <div className="flex flex-row">
                    <FaHistory size={25} className="mr-2 text-green-500" />
                    <p className="text-sm md:text-base text-white ">
                      Search History
                    </p>
                  </div>
                  {/* Display Search History here */}
                  {searchHistory.map((item, index) => (
                    <p
                      key={index}
                      className="flex items-center mb-2 rounded-base hover:bg-slate-500 px-3"
                    >
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
            </div>
            {/* Footer */}
            <footer className="mt-auto mb-9 flex justify-center">
              <button
                className="py-2 px-10 md:px-16 lg:px-36 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none"
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

        <div class="right flex-1 overflow-y-auto md:h-auto   md:w-1/3 ">
          <div className="p-2 md:p-4 rounded-xl m-1 md:m-5 mb-16 md:mb-6 md:mt-20 ">
            <h1 className="mb-4 text-2xl font-bold  text-center text-white">
              For You
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
                        className="h-12 w-12 md:h-12 md:w-12 mr-2 rounded-full object-cover  transition-opacity duration-100 hover:opacity-40"
                        onClick={e=>e.stopPropagation()}
                      />
                    ) : (
                      <FaUserCircle className="h-12 w-12 mr-2" />
                    )}
                    
                    <p className=" text-lg font-semibold " >
                      {post.user.name}
                    </p>
                 

                    <p className=" text-sm ml-auto">
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
                          className="object-cover mx-auto rounded-lg object-center  transition-opacity duration-100 hover:opacity-40"
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
                      {post.likes.includes(cid) ? (
                        // Render unlike button
                        <FcLike
                          onClick={(e) => handleUnlike(e, post._id)}
                          size={24}
                          className="cursor-pointer mr-2 text-red-500"
                        />
                      ) : (
                        // Render like button
                        <CiHeart
                          onClick={(e) => handleLike(e, post._id)}
                          size={24}
                          className="cursor-pointer mr-2 text-red-500"
                        />
                      )}
                      <p className="text-gray-500">{post.likes.length}</p>
                    </div>
                    <div className="flex items-center">
                      <GoComment
                        size={20}
                        className="text-blue-500 cursor-pointer hover:text-green-500 mr-2"
                      />
                      <p className="text-gray-500">{post.comments.length}</p>
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
        <div id="trending" className="hidden md:block md:w-1/4 m-1   ">
          <div className="p-2  rounded-xl m-2 md:m-5 mb-16 md:mb-6 md:mt-24  overflow-hidden bg-[#526b9e]">
          <Link to={'/app/trending'}>
            <h1 className="mb-4 text-2xl font-bold text-white text-center flex items-center justify-center">
              Trending Posts
              <FaArrowRightLong className="m-4  rounded-full text-black text-lg cursor-pointer" size={25}/>
            </h1>
            </Link>
            <div className="grid grid-cols-1 gap-4 text-sm md:text-xl overflow-y-auto max-h-[500px] transition-all duration-1000">
              {/* Map through trendingPosts array and render each post */}
              {trendingPosts.map((post) => (
                <div
                  key={post._id}
                  className="p-6 rounded-xl shadow-xl cursor-pointer   mb-4"
                  onClick={() => viewPost(post._id)}
                  data-theme={t.includes('light') ? 'light' : 'night'}
                >
                  <div className="flex items-center mb-4">
                    {post.user.image ? (
                      <Avatar
                        src={post.user.image}
                        alt="User"
                        className="mr-2 w-10 h-10 rounded-full  transition-opacity duration-100 hover:opacity-40"
                      />
                    ) : (
                      <FaUserCircle className="w-10 h-10 mr-2 " />
                    )}
                    <p className=" text-base font-semibold">
                      {post.user.name.split(" ")[0]}
                    </p>
                  </div>
                  <div className="flex flex-row items-center justify-between mb-2">
                    <div className="flex flex-col mr-4">
                      <h3 className="text-lg font-semibold mb-1 ">
                        {post.title.split(" ").slice(0, 3).join(" ")}
                        {post.title.split(" ").length > 3 && "..."}
                      </h3>
                      <p className=" text-sm">
                        {post.description.split(" ").slice(0, 5).join(" ")}
                        {post.description.split(" ").length > 5 && "..."}
                      </p>
                    </div>
                    {post.tof === "pic" && (
                      <img
                        src={post.image}
                        alt="Post Image"
                        className="w-20 h-16 object-cover rounded-lg border border-gray-300  transition-opacity duration-100 hover:opacity-40"
                      />
                    )}
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center mr-4">
                      <CiHeart className="text-red-500 mr-1" />
                      <span className="">{post.likesCount}</span>
                    </div>
                    <div className="flex items-center">
                      <GoComment className="text-blue-500 mr-1" />
                      <span className=''>
                        {post.commentsCount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
