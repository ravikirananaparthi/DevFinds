import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { SlCalender, SlGraph } from "react-icons/sl";
import { CiHeart } from "react-icons/ci";
import { FaShare } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { GoComment } from "react-icons/go";
import moment from "moment";
import { useParams } from "react-router-dom";
import View from "./View";
import { MdReportProblem } from "react-icons/md";
import Proske from "./Proske";
import ReactPlayer from "react-player";
import { GrTechnology } from "react-icons/gr";
import { FaUserSecret } from "react-icons/fa";
import { Context, server } from "../main";
function Userprofile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const { userid } = useParams();
  const {t}=useContext(Context);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${server}users/${userid}`,
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        console.log(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userid) {
      const fetchPosts = async () => {
        try {
          const response = await axios.get(
            `${server}posts/user/${userid}`,
            {
              withCredentials: true,
            }
          );
          setPosts(response.data.posts);
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    }
  }, [userid]);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowPopup(true);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  if (loading) {
    return <Proske />;
  }
  const getPostFileName = (url) => {
    const segments = url.split("/");
    const lastSegment = segments[segments.length - 1];
    const fileName = decodeURIComponent(lastSegment.split("?")[0]);
    return fileName;
  };
  console.log(posts);
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-16">
          <div className="p-4 bg-gray-700 text-white rounded-lg shadow col-span-1 max-h-[576px] overflow-auto sm:sticky t-0  top-0">
            <div className="flex flex-col mb-4 h-5/6">
              <h1 className="text-2xl font-semibold mb-4">Users Profile Page</h1>
              <div className="mb-4">
                {user && user.image ? (
                  <img
                    src={user.image}
                    alt="Profile Picture"
                    className="p-1 border-2 border-green-500 border-solid rounded-full object-cover"
                    style={{ width: "150px", height: "150px" }}
                  />
                ) : (
                  <FaUserCircle
                    size={100}
                    className="p-1 text-black border-2 border-green-500 border-solid rounded-full"
                  />
                )}
                {user && (
                  <ul className="mt-4 text-lg">
                    <li>
                      <span className="font-semibold">Username: </span>
                      <span>{user.name}</span>
                    </li>
                    <li>
                      <span>Email: </span>
                      <span>{user.email}</span>
                    </li>
                    <li className="flex items-center py-2">
                      <SlCalender size={23} className="pr-2" />
                      <span>
                        Joined on{" "}
                        {moment(user.createdAt).format("MMMM Do YYYY, h:mm a")}
                      </span>
                    </li>
                    <li className="flex items-center py-2">
                      <FaUserSecret size={23} className="pr-2" />
                      <span>
                        Programming Experience: {user?.programmingExperience}
                      </span>
                    </li>
                    <li className="flex items-center text-white">
                      <GrTechnology size={23} className="pr-2" />
                      <p className="mr-2">Skills:</p>
                      <span>
                        {user?.learnedTechnologies.map((technology, index) => (
                          <span key={index} className="mr-2 text-white">
                            {technology}
                          </span>
                        ))}
                      </span>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="  rounded-lg shadow col-span-2  ">
            <h2 className="text-2xl font-semibold mb-4">Posts Page</h2>
            <div className="grid grid-cols-1 gap-3 text-sm md:text-lg">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className=" p-6 rounded-xl shadow-xl cursor-pointer"
                  onClick={() => handlePostClick(post)}
                  data-theme={t.includes('light') ? 'light' : 'night'}
                >
                  <div className="flex items-center mb-2">
                    {post.user.image ? (
                      <img
                        src={post.user.image}
                        alt="User Profile"
                        className="h-14 w-14 mr-2 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="h-14 w-14 mr-2" />
                    )}
                    <p className="text-lg font-semibold">{post.user.name}</p>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <p className=" mb-4">{post.description}</p>
                  {post.tof == "pic" && post?.image && (
                    <img
                      src={post?.image}
                      alt="post image"
                      className="flex mx-auto w-380 h-220 rounded-lg"
                      style={{ borderRadius: "2%" }}
                    />
                  )}
                  {post.tof === "vid" && post.image && (
                    <ReactPlayer
                      url={post.image}
                      controls={true}
                      width="100%"
                      height="auto"
                      className="mb-4"
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
                      href={post.image} // Assuming post.image contains the URL
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                    >
                      <img
                        src="https://static-00.iconduck.com/assets.00/folder-icon-512x410-jvths5l6.png"
                        alt="Folder Icon"
                        className="w-6 h-6"
                      />
                      <span>{getPostFileName(post.image)}</span>
                    </a>
                  )}
                  <div className="flex items-center justify-around mt-3">
                    <div className="flex items-center">
                      <CiHeart size={20} className="cursor-pointer mr-2" />
                      <p className="">{post.likes.length}</p>
                    </div>
                    <div className="flex items-center">
                      <GoComment
                        size={20}
                        className="text-blue-500 cursor-pointer hover:text-green-500 mr-2"
                      />
                      <p className="">{post.comments.length}</p>
                    </div>
                    <FaShare
                      size={20}
                      className="text-blue-500 cursor-pointer"
                      onClick={() => {}}
                    />
                  </div>
                  <div className="flex items-center justify-between ">
                    <div className="font-semibold">
                      <button onClick={e=>{e.stopPropagation();}}className="flex items-center text-red-500 bg-transparent py-1 px-2 rounded-lg transition duration-300 hover:bg-red-500 hover:text-white">
                        <MdReportProblem className="mr-2" />
                        <span>Report Post</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10"></div>
        </div>
      </div>
      {/* Render popup */}
      {showPopup && (
        <div className="popup">
          <View
            className="mt-30"
            post={selectedPost}
            onClose={handleClosePopup}
          />
        </div>
      )}
    </div>
  );
}

export default Userprofile;
