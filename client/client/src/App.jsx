import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";

import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context, server } from "./main";
import Posts from "./pages/Posts";
import Feed from "./pages/Feed";
import PostDetail from "./components/PostDetail";
import Userprofile from "./components/Userprofile";
import Notifications from "./components/Notifications";
import { io } from "socket.io-client";
import Dm from "./pages/Dm";
import Bottom from "./components/Bottom";
import Proske from "./components/Proske";
import Googleregister from "./pages/Googleregister";
import Landing from "./pages/Landing";
import Navbar from "./components/NavBar.jsx";
import SkePostdetail from "./components/SkePostdetail.jsx";
import TrendingPosts from "./components/Trendingposts.jsx";
import Trending from "./pages/Trending.jsx";

const ser = "https://devfinds-backend.onrender.com";

console.log(import.meta.env.SER);
const socket = io(`${ser}`, {
  reconnection: true,
});

function App(props) {
  const { isAuthenticated, setUser, setAuth, setLoader, setfetch } =
    useContext(Context);
  const [notifications, setNotifications] = useState([]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  useEffect(() => {
    setLoader(true);
    axios
      .get(`${server}users/me`, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.user);
        setAuth(true);
        setLoader(false);
      })
      .catch((error) => {
        setUser({});
        setAuth(false);
        setLoader(false);
      });
  }, [isAuthenticated]);
  const token = localStorage.getItem('token') 
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app/*" element={<ProtectedRoutes />} />
      </Routes>
    </Router>
  );
}
function ProtectedRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/viewposts" element={<Feed />} />
        <Route path="/posts/:postId" element={<PostDetail />} />
        <Route path="/userprofile/:userid" element={<Userprofile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/message" element={<Dm />} />
        <Route path="/register/google" element={<Googleregister />} />
        <Route path="/hi" element={<TrendingPosts/>} />
        <Route path='/trending' element={<Trending/>}/>
      </Routes>
      <Bottom />
      <Toaster />
    </>
  );
}

export default App;
