import React, { useState, useEffect } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import "./Profile.css";
import { fetchUserInfo } from "../../services/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currTab, setCurrTab] = useState("Watchlist");

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const data = await fetchUserInfo();

        setUser(data.profile || data);
      } catch (error) {
        console.error("Error loading user profile:", error.message);
      } finally {
        setLoading(false);
      }
    };
    loadUserInfo();
  }, []);

  if (loading) return <div className="loading">Loading Profile...</div>;

  if (!user) {
    return (
      <div className="error-container">
        <p>Could not load profile. Please log in again.</p>
        <button onClick={() => (window.location.href = "/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="profile-info-row">
          <img
            src={user.avatar || "../public/assets/new_favicon.png"}
            alt="Avatar"
            className="profile-avatar"
          />
        </div>
        <div className="profile-text">
          <h1>{user.name}</h1>
          <div className="profile-meta">
            <span>{user.watchlist?.length || 0}</span>
            <span className="dot">.</span>
            <span>
              Joined{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}{" "}
            </span>
          </div>
        </div>
        <button className="edit-btn">Edit profile</button>
      </header>
      <nav className="profile-nav">
        {["Watchlist", "Activity", "Favorites"].map((tab) => (
          <button
            key={tab}
            className={currTab === tab ? "nav-item active" : "nav-item"}
            onClick={() => setCurrTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
      {/* 3. Conditional Content Rendering */}
      <main className="profile-content">
        {currTab === "Watchlist" && (
          <div className="movie-grid">
            {user.watchlist?.length > 0 ? (
              user.watchlist.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))
            ) : (
              <p className="empty-msg">No movies in your watchlist yet.</p>
            )}
          </div>
        )}

        {currTab === "Activity" && (
          <div className="activity-feed">
            <p className="empty-msg">No recent activity to show.</p>
          </div>
        )}

        {currTab === "Favorites" && (
          <div className="movie-grid">
            <p className="empty-msg">You haven't marked any favorites yet.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
