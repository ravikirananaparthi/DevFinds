import { useContext, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { Context, app } from "../main";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import { Button, Card, CardContent } from "@mui/material";
import { IoCaretBackCircleSharp } from "react-icons/io5";
import { Link, Navigate } from "react-router-dom";
import { server } from "../main";
import "../index.css";

function Posts() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgurl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [activeButton, setActiveButton] = useState(0);
  const [tof, setTof] = useState("pic");
  const [toupload, settoupload] = useState(false);
  const [topost,setTopost]=useState(false);
  const {isAuthenticated}=useContext(Context);

  const handleClick = (index) => {
    setActiveButton(index);
    if (index == 0) {
      setTof("pic");
    } else if (index == 1) {
      setTof("vid");
    } else if (index == 2) {
      setTof("pdf");
    } else {
      setTof("doc");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
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
            setImgUrl(downloadURL);
            settoupload(true);
            console.log("File available at", downloadURL);
          });
        }
      );
    } else {
      console.log("No file selected.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${server}users/posts`,
        { title, description, image: imgurl, tof },
        {
          withCredentials: true,
        }
      );

      if (data.success === true) {
        setTitle("");
        setDescription("");
        setLoading(false);
        setUploadProgress(0);
        alert("Post created successfully");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setLoading(false);
      alert("Failed to create post");
    }
  };
  if (!isAuthenticated) return <Navigate to={"/"} />;
  return (
    <div className="flex justify-center items-center h-screen area">
      <ul class="circles">
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
			</ul>
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-8 pt-24 cursor-pointer">
      <Link to={'/app/viewposts'}>
        <div className="flex items-center">
          <IoCaretBackCircleSharp
            className="text-blue-500 text-3xl cursor-pointer mr-2"
            onClick={() => handleBackToFeed()}
          />
          <h2 className="text-xl font-bold text-black hover:underline">
            Back to Feed
          </h2>
          
        </div>
        </Link>
      </div>
      <Card className="w-full lg:w-2/3 xl:w-1/2 p-8  shadow-lg rounded-lg mt-10 z-10">
        <CardContent>
          <h2 className="text-2xl font-bold text-center mb-6">
            Create a New Post
          </h2>
          <input
            type="text"
            placeholder="Title"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            className="w-full px-4 py-2 mb-4 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-40 px-4 py-2 mb-4 text-gray-800 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-blue-500 bg-white"
          />
          <div className="flex justify-between  bg-gray-200 rounded-full p-1 text-[14px] mb-6">
            <button onClick={() => handleClick(0)}>
              <label>
                <input
                  onChange={handleFileUpload}
                  type="file"
                  className="mb-4 mt-5 "
                  style={{ display: "none" }}
                />
                <p
                  className={`transition-colors px-5 md:px-10 duration-300 ease-in-out rounded-full p-2 ${
                    activeButton === 0
                      ? "bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white"
                      : ""
                  }`}
                >
                  Photo
                </p>
              </label>
            </button>
            <button onClick={() => handleClick(1)}>
              <label>
                <input
                  onChange={handleFileUpload}
                  type="file"
                  className="mb-4 mt-5 "
                  style={{ display: "none" }}
                />
                <p
                  className={`transition-colors px-5 md:px-10 duration-300 ease-in-out rounded-full p-2 ${
                    activeButton === 1
                      ? "bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white"
                      : ""
                  }`}
                >
                  Video
                </p>
              </label>
            </button>
            <button onClick={() => handleClick(2)} className="md:inline hidden">
              <label>
                <input
                  onChange={handleFileUpload}
                  type="file"
                  className="mb-4 mt-5 "
                  style={{ display: "none" }}
                />
                <p
                  className={`transition-colors px-10 duration-300 ease-in-out rounded-full p-2 ${
                    activeButton === 2
                      ? "bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white"
                      : ""
                  }`}
                >
                  Pdf
                </p>
              </label>
            </button>
            <button onClick={() => handleClick(3)}>
              <label>
                <input
                  onChange={handleFileUpload}
                  type="file"
                  className="mb-4 mt-5 "
                  style={{ display: "none" }}
                />
                <p
                  className={` transition-colors   pr-10 duration-300 ease-in-out rounded-full p-2 ${
                    activeButton === 3
                      ? "bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white"
                      : ""
                  }`}
                >
                  Document
                </p>
              </label>
            </button>
          </div>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-[70px] h-auto mb-4"
            />
          )}
          {uploadProgress > 0 && (
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              className="mb-4"
            />
          )}
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading || uploadProgress < 100}
            fullWidth
          >
            {loading && toupload ? "Creating Post..." : "Create Post"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Posts;
