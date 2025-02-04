import { useEffect, useState } from "react";
import './Posts.css';

function TalkPosts() {
      const [posts, setPosts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
            const fetchPosts = async () => {
                  try {
                        const response = await fetch("http://localhost:8080/talk");
                        if (!response.ok) {
                              throw new Error("Failed to fetch posts");
                        }
                        const data = await response.json();
                        setPosts(data);
                  } catch (err) {
                        setError(err.message);
                  } finally {
                        setLoading(false);
                  }
            };

            fetchPosts();
      }, []);

      useEffect(() => {
            const handleScroll = () => {
                  document.querySelectorAll("video[data-autoplay]").forEach((video) => {
                        const rect = video.getBoundingClientRect();
                        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
                        if (isVisible) {
                              if (video.paused) {
                                    video.currentTime = 0;
                                    video.play();
                              }
                        } else {
                              video.pause();
                        }
                  });
            };

            window.addEventListener("scroll", handleScroll);
            handleScroll();
            return () => window.removeEventListener("scroll", handleScroll);
      }, [posts]);

      if (loading) return <div className="text-center">Loading...</div>;
      if (error) return <div className="text-center text-red-500">Error: {error}</div>;

      return (
            <div className="p-4 flex justify-center items-center posts">
                  <div className="text-center">
                        {posts.map((post) => (
                              <div key={post._id} className="post-container m-4 p-4 border-none bg-gray-800 rounded-lg shadow-lg">
                                    {post.image ? (
                                          <img src={post.image} alt="Post" className="media-content" />
                                    ) : post.video ? (
                                          <video autoPlay data-autoplay className="media-content">
                                                <source src={post.video} type="video/mp4" />
                                                Your browser does not support the video tag.
                                          </video>
                                    ) : null}
                                    {post.description && (
                                          <p className="text-white leading-6 mt-2 description">{post.description}</p>
                                    )}
                              </div>
                        ))}
                  </div>
            </div>
      );
}

export default TalkPosts;