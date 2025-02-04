import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./User.css";
import { FaEdit, FaUsers, FaShare, FaEnvelope, FaUserMinus, FaUserPlus } from "react-icons/fa";

function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // Store logged-in user ID

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch logged-in user details
        const authResponse = await fetch(`http://localhost:8080/user/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!authResponse.ok) {
          throw new Error("Failed to fetch logged-in user");
        }

        const authData = await authResponse.json();
        setCurrentUserId(authData._id); // Store logged-in user ID

        // Fetch profile user details
        const response = await fetch(`http://localhost:8080/user/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();

        // Check if the logged-in user is already following this user
        const isFollowing = data.followers.includes(authData._id);

        setUser({ ...data, isFollowing });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleFollow = async () => {
    if (user.isFollowing) return; // Prevent duplicate follow requests

    try {
      setUser(prev => ({
        ...prev,
        followers: [...prev.followers, currentUserId],
        isFollowing: true,
      }));

      const response = await fetch(`http://localhost:8080/user/follow/${id}`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to follow user");
      }
    } catch (error) {
      console.error(error);
      setUser(prev => ({
        ...prev,
        followers: prev.followers.filter(f => f !== currentUserId),
        isFollowing: false,
      }));
    }
  };

  const handleUnfollow = async () => {
    try {
      setUser(prev => ({
        ...prev,
        followers: prev.followers.filter(f => f !== currentUserId),
        isFollowing: false,
      }));

      const response = await fetch(`http://localhost:8080/user/unfollow/${id}`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to unfollow user");
      }
    } catch (error) {
      console.error(error);
      setUser(prev => ({
        ...prev,
        followers: [...prev.followers, currentUserId],
        isFollowing: true,
      }));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="profile-container">
      <img src={user.profile || "default-profile.png"} alt="Profile" />
      <h2>{user.username || "Unknown User"}</h2>
      <div className="stats">
        <div>{(user.posts && user.posts.length) || 0} Posts</div>
        <div>{(user.followers && user.followers.length) || 0} Followers</div>
        <div>{(user.following && user.following.length) || 0} Following</div>
      </div>
      <div className="action-buttons">
        <div className="btn-actions"><FaEdit /></div>
        <div className="btn-actions"><FaShare /></div>
        <div className="btn-actions"><FaEnvelope /></div>
        <button className="btn-actions" onClick={() => window.location.href = `/user/followers/${user._id}`}>
          <FaUsers />
        </button>
        {user.isFollowing ? (
          <button className="btn-actions" onClick={handleUnfollow}>
            <FaUserMinus />
          </button>
        ) : (
          <button className="btn-actions" onClick={handleFollow}>
            <FaUserPlus />
          </button>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
