import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileAvatar from "../components/ProfileAvatar";
import Sidebar from "../components/Sidebar";
import "../styles/Profile.css";

export default function Profile() {
  const { operatorId } = useParams(); // /profile/:operatorId
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", role: "" });
  const [editMode, setEditMode] = useState(false);

  //GET employee info
  useEffect(() => {
    axios
      .get(`http://localhost:5001/profile/${operatorId}`)
      .then((response) => {
        setProfile(response.data);
        setFormData({
          name: response.data.name,
          phone: response.data.phone,
          role: response.data.role,
        });
      })
      .catch((error) => console.error("Error fetching employee:", error));
  }, [operatorId]);

  //PATCH employee info
  function handleUpdate(e) {
    e.preventDefault();
    axios
      .patch(`http://localhost:5001/profile/${operatorId}`, formData)
      .then((response) => {
        setProfile(response.data);
        setEditMode(false);
      })
      .catch((error) => console.error("Error updating employee:", error));
  }

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
              <p><strong>Phone:</strong> {profile.phone}</p>
              <p><strong>Role:</strong> {profile.role}</p>
            </div>
          </div>

          <div className="profile-settings">
            <h3>Settings</h3>
            {!editMode ? (
              <>
                <button className="edit-btn" onClick={() => setEditMode(true)}>
                  Edit Profile
                </button>
                <button className="password-btn">Change Password</button>
              </>
            ) : (
              <form onSubmit={handleUpdate} className="edit-form">
                <label>
                  Name:
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </label>
                <label>
                  Phone:
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </label>
                <label>
                  Role:
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  />
                </label>
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

