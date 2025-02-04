import { useState, useEffect } from "react";
import "./User.css";
import { FaEdit, FaTrash, FaUsers, FaShare, FaEnvelope } from "react-icons/fa";

function Profile () {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      useEffect(() => {
            const fetchUser = async () => {
                  try {
                        const response = await fetch("http://localhost:8080/currUser", {
                              method: "GET",
                              credentials: "include",
                        });
                        if (!response.ok) {
                              throw new Error("Failed to fetch user data");
                        }
                        const data = await response.json();
                        setUser(data);
                  } catch (err) {
                        setError(err.message);
                  } finally {
                        setLoading(false);
                  }
            };
            fetchUser();
      }, []);
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error}</p>;
      return (
            <div className="profile-container">
                  <img src={user.profile || "default-profile.png"} alt="Profile Picture" />
                  <h2>{user.username || "Unknown User"}</h2>
                  <div className="stats">
                        <div>{(user.posts && user.posts.length) || 0} Posts</div>
                        <div>{(user.followers && user.followers.length) || 0} Followers</div>
                        <div>{(user.following && user.following.length) || 0} Following</div>
                  </div>
                  <div className="action-buttons">
                        <div className="btn-actions"><FaEdit /></div>
                        <div className="btn-actions"><FaTrash /></div>
                        <form className="btn-actions" action={`/user/followers/${user._id || "#"}`} method="GET">
                              <button className="btn-actions" style={{ border: "none" }} type="submit">
                                    <FaUsers />
                              </button>
                        </form>
                        <div className="btn-actions"><FaShare /></div>
                        <div className="btn-actions"><FaEnvelope /></div>
                  </div>
            </div>
      );
};

export default Profile;
