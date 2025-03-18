import { useState, useEffect } from "react";
import { auth, db } from "./firebase-config.js";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        setEmail(currentUser.email);
        
        const userRef = doc(db, "User", currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          setName(userDoc.data().name || "");
        } else {
          await setDoc(userRef, {
            email: currentUser.email,
            name: "",
            createdAt: new Date()
          });
          setName("");
        }
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const updateProfile = async () => {
    if (user) {
      const userRef = doc(db, "User", user.uid);
      await updateDoc(userRef, { name });
      alert("Profile updated successfully!");
      setIsEditing(false);
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