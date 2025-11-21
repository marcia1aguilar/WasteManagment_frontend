import { useEffect, useState } from "react";
import ProfileAvatar from "../components/ProfileAvatar";
import Sidebar from "../components/Sidebar";
import "../styles/Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setProfile({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      role: "Operator",
    });
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <div className="main-layout">
        <Sidebar />

        <div className="content-area">
          <h2>My Profile</h2>

          <div className="profile-header">
            <ProfileAvatar />
            <div className="profile-info">
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Role:</strong> {profile.role}</p>
            </div>
          </div>

          <div className="profile-settings">
            <h3>Settings</h3>
            <button className="edit-btn">Edit Profile</button>
            <button className="password-btn">Change Password</button>
          </div>
        </div>
      </div>
    </div>
  );
}

