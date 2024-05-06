import React, { useContext, useEffect, useRef, useState } from "react";
import { TiAttachment } from "react-icons/ti";
import { IoSend } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Context, app } from "../main";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import sentTone from "../assets/w.mp3";
import receiveTone from "../assets/mg.mp3";
import { IoMdPhotos } from "react-icons/io";
import { FaVideo } from "react-icons/fa";
import { IoDocumentAttach } from "react-icons/io5";
import validUrl from "valid-url";
import ImageViewer from "react-simple-image-viewer";
import Avatar from "@mui/material/Avatar";
import moment from "moment";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import ReactPlayer from "react-player";
import { server } from "../main";
import { Link } from "react-router-dom";
function FriendDM({ friend, onBack, socket }) {
  const { user } = useContext(Context);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const sentAudio = new Audio(sentTone);
  const receiveAudio = new Audio(receiveTone);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imgurl, setImgUrl] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [otherUrls, setOtherUrls] = useState([]);
  const [mg, setmg] = useState("");
  const scrollableRef = useRef(null);
  let tof1;
  const getPostFileName = (url) => {
    const segments = url.split("/");
    const lastSegment = segments[segments.length - 1];
    const fileName = decodeURIComponent(lastSegment.split("?")[0]);
    return fileName;
  };

  const toggleAttachmentMenu = (e) => {
    e.preventDefault();
    setAttachmentMenuOpen((prevState) => !prevState);
  };

  // Function to handle attachment selection
  const handleAttachmentSelect = (type) => {
    // Perform actions based on attachment type
    console.log("Selected attachment type:", type);
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
            setMessage(downloadURL);
            setmg(getPostFileName(downloadURL));
            console.log(downloadURL);
            setUploadProgress(0);
          });
        }
      );
    } else {
      console.log("No file selected.");
    }
  };
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.post(
          `${server}message/getmsg`,
          {
            from: user._id,
            to: friend._id,
          },
          { withCredentials: true }
        );
        setMessages(response.data);

        console.log(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
        // Handle error
      }
    };

    fetchMessages(); // Call the asynchronous function
  }, [friend]); // Ensure the empty dependency array to mimic componentDidMount

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    setmg(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    try {
      // Send the message to the backend
      socket.current.emit("send-msg", {
        to: friend._id,
        from: user._id,
        message,
      });

      const response = await axios.post(
        `${server}message/addmsg`, 
        {
          from: user._id, 
          to: friend._id,
          message: message,
          messageType: "text",
        },
        { withCredentials: true } 
      );

      console.log(response.data); // Log the response data
      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: message });
      setMessages(msgs);
      setmg(msgs);
      setImageUrls(msgs);
      sentAudio.play();
      // Reset message input after sending

      setMessage("");
      setmg('');
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        console.log(msg);
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
      setmg((prev) => [...prev, arrivalMessage]);
      receiveAudio.play();
    }
  }, [arrivalMessage]);
  
  const openImageViewer = (index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };
  const imageUrls1 = {};

  messages.forEach((msg, index) => {
    if (validUrl.isUri(msg.message)) {
      const fileName = getPostFileName(msg.message);
      if (/\.(jpeg|jpg|gif|png)$/i.test(fileName)) {
        imageUrls1[index] = msg.message;
      }
    }
  });
  console.log(imageUrls1);
  console.log(messages);
  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTo({
        top: scrollableRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]); // Dependency array includes only `messages`

  const scrollToBottom = () => {
    // Alternatively, you can use window.scrollTo if you need finer control or targeting the entire page
    if (scrollableRef.current) {
      scrollableRef.current.scrollTo({
        top: scrollableRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  function formatTime(utcTime) {
    if (utcTime === undefined) {
      // Use Date.now() and new Date() for current time and date
      const now = Date.now();
      const date = new Date(now);

      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const adjustedHours = hours % 12 || 12; // Convert to 12-hour format (12 for midnight)
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed (0-11)
      const year = date.getFullYear();

      return `${adjustedHours}:${minutes} ${ampm}, ${day}/${month}/${year}`;
    } else {
      const date = new Date(utcTime);

      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const adjustedHours = hours % 12 || 12; // Convert to 12-hour format (12 for midnight)
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed (0-11)
      const year = date.getFullYear();

      return `${adjustedHours}:${minutes} ${ampm}, ${day}/${month}/${year}`;
    }
  }
  return (
    <div className="flex flex-col h-screen w-full">
      <div className="bg-gray-900 p-4 flex items-center justify-between ">
        <div className="flex items-center">
          {/* Back Button (visible on small screens) */}
          <button onClick={onBack} className="text-blue-500 md:hidden mr-4">
            <IoMdArrowRoundBack size={25} />
          </button>
          {friend.image ? (
            <Avatar alt="h" src={friend.image} className="mr-2" />
          ) : (
            <FaUserCircle className="w-10 h-10 mr-2 " />
          )}
          <h2 className="text-xl font-semibold text-white">{friend.name}</h2>
        </div>
      </div>

      {/* DM Area */}
      <div className="flex-grow bg-gray-800 p-4 flex flex-col justify-between">
        <div
          className="flex-grow overflow-y-auto scroll-smooth"
          ref={scrollableRef}
        >
          {/* Messages display area */}
          <div className="mb-6" style={{ maxHeight: "calc(100vh - 200px)" }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat ${
                  msg.fromSelf ? "chat-end" : "chat-start"
                } mb-6 `}
              >
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    {msg.fromSelf ? (
                      user?.image ? (
                        <img alt="User Avatar" src={user.image} />
                      ) : (
                        <FaUserCircle size={37} />
                      )
                    ) : friend?.image ? (
                      <img alt="Friend Avatar" src={friend.image} />
                    ) : (
                      <FaUserCircle size={37} />
                    )}
                  </div>
                </div>

                {typeof msg.message === "string" ? (
                  validUrl.isUri(msg.message) ? (
                    <>
                      {(tof1 = getPostFileName(msg.message))}
                      {tof1 && /\.(jpeg|jpg|gif|png)$/i.test(tof1) ? (
                        <img
                          src={msg.message}
                          alt="Uploaded"
                          className="max-w-56 max-h-56 object-contain rounded-lg border-8 border-indigo-500"
                          onClick={() => openImageViewer(index)}
                        />
                      ) : null}
                      {tof1 && /\.(mp4|ogg|webm)$/i.test(tof1) ? (
                        <ReactPlayer
                          url={msg.message}
                          controls={true}
                          width="60%"
                          height="auto"
                          className="mb-4"
                          playing={false} // Auto play the video
                          loop={false} // Loop the video
                          muted={false} // Mute the video
                          pip={true} // Picture-in-Picture mode
                          config={{
                            youtube: {
                              playerVars: { showinfo: 1 }, // YouTube player options
                            },
                          }}
                        />
                      ) : null}
                      {tof1 &&
                      /\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i.test(tof1) ? (
                        <a
                          href={msg.message}
                          target="_blank"
                          rel="noopener noreferrer"
                          className=" bg-indigo-400 border-8 border-indigo-500 rounded-lg text-white"
                        >
                          {tof1}
                        </a>
                      ) : null}
                      {isViewerOpen && (
                        <ImageViewer
                          src={imageUrls1}
                          currentIndex={currentImage}
                          disableScroll={false}
                          closeOnClickOutside={true}
                          onClose={closeImageViewer}
                        />
                      )}
                    </>
                  ) : (
                    <div className="chat-bubble chat-bubble-primary text-white">
                      {msg.message}
                      <div className="chat-footer opacity-50">
                        {formatTime(msg.createdAt)}
                      </div>
                    </div>
                  )
                ) : (
                  <Link to={`/app/posts/${msg.message._id}`}>
                    <div className="bg-white rounded-xl shadow-xl cursor-pointer p-6 grid grid-cols-1 gap-4 text-sm md:text-xl">
                      <div className="flex items-center mb-2">
                        {msg.message.user.image ? (
                          <Avatar
                            alt="h"
                            src={msg.message.user.image}
                            className="mr-2"
                          />
                        ) : (
                          <FaUserCircle className="h-9 w-9 mr-2" />
                        )}
                        <div>
                          <p className="text-black text-lg font-semibold">
                            {msg.message.user.name}
                          </p>
                          <p className="text-gray-500 text-sm ml-auto">
                            {moment(msg.message.createdAt).fromNow()}
                          </p>
                        </div>
                      </div>
                      {msg.message.tof === "pic" && msg.message.image && (
                        <img
                          className="w-40 h-40 object-cover rounded-lg mb-2"
                          src={msg.message.image}
                          alt="Post Image"
                        />
                      )}
                      <h3 className="text-xl font-semibold mb-2 text-black">
                        {msg.message.title}
                      </h3>
                      <p className="text-gray-700">
                        {msg.message.description.split(" ").length > 15
                          ? `${msg.message.description
                              .split(" ")
                              .slice(0, 15)
                              .join(" ")} ...`
                          : msg.message.description}
                      </p>
                    </div>
                    <div className="chat-footer opacity-50">
                      {formatTime(msg.createdAt)}
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="">
          <div className="flex items-center relative ">
            <form
              onSubmit={handleSendMessage}
              className="  flex-grow flex mb-11 md:mb-0"
            >
              <textarea
                value={mg}
                onChange={handleMessageChange}
                placeholder="Type a message..."
                className="flex-grow rounded-full px-4 mr-4 border border-gray-300 focus:outline-none resize-none text-white"
              />
              <button
                onClick={(e) => toggleAttachmentMenu(e)}
                className="absolute top-0 right-0 mt-1 mr-24 text-white hover:border hover:border-gray-900 rounded-full hover:bg-slate-600 p-1"
              >
                <TiAttachment size={30} />
              </button>
              {attachmentMenuOpen && (
                <div className="absolute bottom-28 md:bottom-14 right-0 bg-white p-2 rounded-lg h-[250px] w-[370px] md:w-[400px] shadow-lg ">
                  <div className="cursor-pointer  mb-7 mt-10 flex flex-col space-y-7 ml-7 text-black">
                    <label className="cursor-pointer flex items-center">
                      <input
                        type="file"
                        className="mb-4 mt-5 "
                        onChange={handleFileUpload}
                        style={{ display: "none" }}
                      />
                      <IoMdPhotos className="mr-2 cursor-pointer" size={20} />
                      Photo
                    </label>
                  </div>
                  <div className="cursor-pointer flex items-center mb-7 ml-7 text-black">
                    <label className="cursor-pointer flex items-center">
                      <input
                        type="file"
                        className="mb-4 mt-5 "
                        onChange={handleFileUpload}
                        style={{ display: "none" }}
                      />
                      <FaVideo className="mr-2 cursor-pointer" size={20} />
                      Video
                    </label>
                  </div>
                  <div className="cursor-pointer flex items-center mb-7 ml-7 text-black">
                    <label className="cursor-pointer flex items-center">
                      <input
                        type="file"
                        className="mb-4 mt-5 "
                        onChange={handleFileUpload}
                        style={{ display: "none" }}
                      />
                      <IoDocumentAttach
                        className="mr-2 cursor-pointer"
                        size={20}
                      />
                      Document
                    </label>
                  </div>
                  {uploadProgress > 0 && (
                    <div className="text-black">
                      Upload Progress: {uploadProgress}%
                    </div>
                  )}
                  {imgurl && (
                    <button
                      onClick={() => {
                        handleSendMessage;
                        setAttachmentMenuOpen(false);
                      }}
                      className="bg-green-800 text-white rounded-full p-2 pl-3 hover:bg-green-600 ml-40"
                    >
                      Send File
                    </button>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="bg-indigo-500 text-white rounded-full p-2 pl-3 hover:bg-indigo-600"
              >
                <IoSend size={25} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendDM;
