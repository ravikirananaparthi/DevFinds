import React from "react";
import { FaUserCircle, FaShare } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import moment from "moment";
import ReactPlayer from "react-player";
function View({ post, onClose, user }) {
  const handlePopupClose = () => {
    onClose();
  };

  return (
    <div className="fixed top-0 left-0  w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 overflow-auto">
      <div className="max-w-3xl w-full p-8 bg-white rounded-2xl shadow-lg max-h-full overflow-y-auto">
        <div className="flex items-center mb-4">
          {post.user.image ? (
            <img
              src={post.user.image}
              alt="User Profile"
              className="h-14 w-14 mr-2 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="h-12 w-12 mr-2" />
          )}
          <div>
            <p className="text-black font-semibold">{post.user.name}</p>
            <p className="text-gray-500">
              Posted {moment(post.createdAt).fromNow()}
            </p>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-black">{post.title}</h1>
        <p className="text-gray-600 mb-4">{post.description}</p>
        {post.tof == "pic" && post.image && (
          <div className="relative rounded-lg overflow-hidden mb-8">
            <div className="aspect-w-16 aspect-h-9">
              <img src={post.image} alt="Post Image" className="object-cover" />
            </div>
          </div>
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
        <div className="border-t border-gray-300 pt-4 flex items-center justify-between">
          <div className="flex items-center">
            <CiHeart size={24} className="cursor-pointer mr-2 text-gray-500" />
            <p className="text-gray-600">{post.likes.length} Likes</p>
          </div>
          <div className="flex items-center">
            <FaShare size={24} className="text-blue-500 cursor-pointer" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2 text-black">
            {post.comments.length} Comments
          </h3>
          <ul className="divide-y divide-gray-300">
            {post.comments.map((comment) => (
              <li key={comment._id} className="py-4">
                <div className="flex flex-row items-center mb-2">
                  {comment.postedBy.image ? (
                    <img
                      src={comment.postedBy.image}
                      alt="User Profile"
                      className="h-6 w-6 mr-2 rounded-full"
                    />
                  ) : (
                    <FaUserCircle className="h-6 w-6 mr-2" />
                  )}
                  <p className="text-gray-700 font-semibold">
                    {comment.postedBy.name}
                  </p>
                  <p className="text-gray-500 text-sm ml-auto">
                    {moment(comment.createdAt).fromNow()}
                  </p>
                </div>
                <p className="text-gray-600">{comment.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <button
          className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
          onClick={handlePopupClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default View;
