import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import "./App.css";

function Profile() {
  const [user, setUser] = useState(null); // full user object
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/info", {
          withCredentials: true,
        });
        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      } catch (err) {
        console.error("Not authenticated or failed to fetch user:", err);
        navigate("/");
      }
    };

    fetchUser();
  }, [navigate]);

  const updateProfile = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/user/update",
        { name },
        { withCredentials: true }
      );
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed.");
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>

      <div className="profile-picture-container">
        <div className="profile-picture">
          <span className="profile-icon">👤</span>
        </div>
        <button className="change-picture-btn" onClick={() => alert("Feature coming soon!")}>
          Change Picture
        </button>
      </div>

      <div className="profile-content">
        <label>Email:</label>
        <p className="profile-text">{email}</p>

        <label>Name:</label>
        {isEditing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Enter your name"
          />
        ) : (
          <p className="profile-text">{name || "Not Set Yet"}</p>
        )}

        <button
          onClick={isEditing ? updateProfile : () => setIsEditing(true)}
          className="edit-save-btn"
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
}

export default Profile;
