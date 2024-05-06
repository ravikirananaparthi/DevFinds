import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from '../main';
const TrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const response = await axios.get(`${server}posts/trendingpost`, {
          withCredentials: true, // Include credentials for cross-origin requests
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json' // Set appropriate content type if sending data
          }
        });
        setTrendingPosts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching trending posts:', error);
        // Handle errors appropriately, e.g., display error message to user
      }
    };
  
    fetchTrendingPosts();
  }, []);
console.log(trendingPosts)
  
return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Trending Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {trendingPosts.map((post) => (
          <div key={post._id} className="bg-white rounded shadow-md p-4">
            <img src={post.image} alt={post.title} className="w-full h-40 object-cover mb-4" />
            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-2">{post.description}</p>
            <div className="flex items-center mb-2">
              <img src={post.user.image} alt={post.user.name} className="w-8 h-8 rounded-full mr-2" />
              <span className="text-sm text-gray-700">{post.user.name}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{post.likesCount} Likes</span>
              <span>{post.commentsCount} Comments</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPosts;
