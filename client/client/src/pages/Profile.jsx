import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaRegUser } from "react-icons/fa";
import { SlCalender, SlGraph } from "react-icons/sl";
import { CiHeart } from "react-icons/ci";
import { FaUserCircle, FaShare, FaPlusCircle } from "react-icons/fa";
import View from "../components/View";
import { RiDeleteBin5Line } from "react-icons/ri";
import { GoComment } from "react-icons/go";
import { FaCirclePlus } from "react-icons/fa6";
import { Context, app } from "../main";
import { IoMail } from "react-icons/io5";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import ReactPlayer from "react-player";
import Proske from "../components/Proske";
import { GrTechnology } from "react-icons/gr";
import { FaUserSecret } from "react-icons/fa";
import { server } from "../main";
import { Navigate } from "react-router-dom";
import ImageViewer from "react-simple-image-viewer";
function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imgurl, setImgUrl] = useState("");
  const { isAuthenticated, t } = useContext(Context);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const handlePostToBackend = async (imageUrl) => {
    try {
      const response = await axios.post(
        `${server}users/profilepic`,
        {
          imageUrl, // Send the image URL to the backend
        },
        {
          withCredentials: true,
        }
      );
      console.log("Post to backend successful:", response.data);
      // You can update the posts state here if required
    } catch (error) {
      console.error("Error posting to backend:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${server}users/me`, {
          withCredentials: true,
        });
        setUser(response.data.user);
        console.log(response.data.user);
        if (response.data.user && response.data.user._id) {
          setUserId(response.data.user._id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchPosts = async () => {
        try {
          const response = await axios.get(`${server}posts/user/${userId}`, {
            withCredentials: true,
          });
          setPosts(response.data.posts.reverse());
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    }
  }, [userId]);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowPopup(true);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const handleDeletePost = async (postId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`${server}posts/delete/${postId}`, {
        withCredentials: true,
      });
      // Filter out the deleted post from the posts state
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    if (file) {
      const storage = getStorage(app);
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading file:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setImgUrl(downloadURL);
            handlePostToBackend(downloadURL);
            setUser((prevUser) => ({ ...prevUser, image: downloadURL }));
            setUploadProgress(0);
          });
        }
      );
    } else {
      console.log("No file selected.");
    }
  };
  const getPostFileName = (url) => {
    const segments = url.split("/");
    const lastSegment = segments[segments.length - 1];
    const fileName = decodeURIComponent(lastSegment.split("?")[0]);
    return fileName;
  };
  const openImageViewer = (index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  }; 
  if (loading) {
    return <Proske />;
  }
  if (!isAuthenticated) return <Navigate to={"/"} />;
  console.log(posts);
  return (
    <div className="">
      <div class="sm:overflow-y-auto md:overflow-y-hidden md:flex flex-col md:flex-row h-screen ">
        <div class="md:left overflow-y-auto md:w-1/3 m-4 md:my-auto ">
          <div className="p-4 bg-gray-700 text-white rounded-lg shadow max-h-[576px] overflow-auto sm:sticky mt-28 md:mt-20">
            <div className="flex flex-col mb-4 h-5/6">
              <div className=" mb-4 flex justify-between">
                <h1 className="text-2xl font-semibold">My Profile</h1>
                <div>
                  <IoMail size={32} className="ml-4" />
                </div>
              </div>
              <div className="mb-4 ">
                <div style={{ position: "relative", display: "inline-block" }}>
                  {user && user.image ? (
                    <img
                      src={user.image}
                      alt="Profile Picture"
                      className="p-1 border-2 border-indigo-600 border-solid rounded-full object-cover cursor-pointer"
                      style={{ width: "150px", height: "150px" }}
                      onClick={() => openImageViewer(0)}
                    />
                  ) : (
                    <FaUserCircle
                      size={100}
                      className="p-1  border-2  border-indigo-600 border-solid rounded-full"
                    />
                  )}
                  {isViewerOpen && (
                    <ImageViewer
                      src={[user.image]}
                      currentIndex={currentImage}
                      disableScroll={false}
                      closeOnClickOutside={true}
                      onClose={closeImageViewer}
                    />
                  )}
                  <button>
                    <label>
                      <input
                        onChange={handleFileUpload}
                        type="file"
                        className="mb-4 mt-5 "
                        style={{ display: "none" }}
                      />
                      <FaCirclePlus
                        size={20}
                        className="absolute top-0 right-0 -mr-2 -mt-2 bg-white border-green-500 border-solid  rounded-full text-green-500"
                      />
                    </label>
                  </button>
                </div>
                {uploadProgress > 0 && (
                  <div className="w-full h-2 bg-green-400">
                    <div
                      className="h-full bg-green-600"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
                {user && (
                  <ul className="text-lg gap-1">
                    <li>
                      <span className="font-semibold">Username: </span>
                      <span>{user.name}</span>
                    </li>
                    <li>
                      <span>Email: </span>
                      <span>{user.email}</span>
                    </li>
                    <li className="flex items-center ">
                      <SlCalender size={23} className="pr-2" />
                      <span>
                        Joined on {new Date(user.createdAt).toLocaleString()}
                      </span>
                    </li>
                    <li className="flex items-center ">
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
        </div>
        <div class="right flex-1 overflow-y-auto md:h-auto" >
          <div className="md:p-4 rounded-xl  m-5 mb-24 md:mb-4 md:mt-20" >
            <h2 className="text-2xl font-semibold mb-4 text-white text-center">
              My Posts 
            </h2>
            <div className="grid grid-cols-1 gap-4 text-sm md:text-lg">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className=" p-6 rounded-xl shadow-xl"
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
                    <p className="text-lg font-semibold ">
                      {post.user.name}
                    </p>
                  </div>
                  <h2 className="text-xl font-semibold mb-2 ">
                    {post.title}
                  </h2>
                  <p className=" mb-4 ">{post.description}</p>
                  {post.tof == "pic" && post?.image && (
                    <div className="aspect-auto w-full mb-7 border border-solid rounded-lg border-gray-400  md:overflow-hidden">
                      <div className="">
                        <img
                          src={post?.image}
                          alt="Post Image"
                          className="object-cover  mx-auto rounded-lg object-center"
                          width={400}
                          height={225}
                        />
                      </div>
                    </div>
                  )}
                  {post.tof === "vid" && post.image && (
                    <ReactPlayer
                      url={post.image}
                      controls={true}
                      width="100%"
                      height="auto"
                      className="mb-7"
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
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 hover:bg-slate-300 rounded mb-7"
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
                      <CiHeart size={20} className="cursor-pointer mr-2 text-red-500" />
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
                      <button
                        className="flex items-center text-red-500 bg-transparent py-1 px-2 rounded-lg transition duration-300 hover:bg-red-500 hover:text-white"
                        onClick={(e) => handleDeletePost(post._id, e)}
                      >
                        <RiDeleteBin5Line className="mr-2" />
                        <span>Delete Post</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

export default Profile;
