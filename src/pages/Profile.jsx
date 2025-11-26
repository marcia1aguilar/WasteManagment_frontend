import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileAvatar from "../components/ProfileAvatar";
import Sidebar from "../components/Sidebar";
import "../styles/Profile.css";

export default function Profile() {
  const { operatorId } = useParams(); // /profile/:operatorId


  //GET employee info
  useEffect(() => {
    axios
      .get(`http://localhost:5001/profile/${operatorId}`)
      .then((response) => {
        setProfile(response.data);
        setFormData({
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          birthdate: response.data.birthdate,
          phone: response.data.phone,
          email: response.data.email,
          teamid: response.data.teamid,
          roletype: response.data.roletype,
        });
      })
      .catch((error) => console.error("Error fetching employee:", error));
  }, [operatorId]);

  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({ phone: "", email: "" });
  const [editMode, setEditMode] = useState(false);
  const [passwordIn, setPasswordIn] = useState("");
  const [editPassword, setEditPassword] = useState(false);

  if (!profile) return <p>Loading...</p>;



  //PATCH employee info. 
  function handleUpdate(e) {
    e.preventDefault();

    const updatedData = {
      phone: formData.phone,
      email: formData.email
    };

    axios
      .patch(`http://localhost:5001/profile/${operatorId}`, updatedData)
      .then((response) => {
        setProfile(response.data);
        alert("Profile updated successfully!");
        setEditMode(false);
        setFormData(response.data);


      })
      .catch((error) => console.error("Error updating employee:", error));
  }

  function handleUpdatePassword(e) {
    e.preventDefault();

    const updatedData = {
      password: passwordIn
    };

    axios
      .patch(`http://localhost:5001/profile/${operatorId}`, updatedData)
      .then((response) => {
        alert("Password updated successfully!");
        setEditPassword(false);
        setPasswordIn("");
      })
      .catch((error) => console.error("Error updating employee password:", error));
  }


  const editingTemplate = (
    <form onSubmit={(e) =>
      handleUpdate(e)} className="edit-form">
      <label>
        Phone:
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
        />
      </label>
      <label>
        Email:
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />
      </label>

      <button type="submit" >Save</button>
      <button type="button" onClick={() => setEditMode(false)}>
        Cancel
      </button>
    </form>
  );

  const changingPassword = (
    <form onSubmit={(e) =>
      handleUpdatePassword(e)} className="edit-form">

    <h4>Change Password</h4>
    <label> New Password:
      <input
        type="password"
        name="password"
        value={passwordIn}
        onChange={(e) =>
          setPasswordIn(e.target.value)
        }
      />
    </label>

    <button type="submit" >Save new Password</button>
    <button type="button" onClick={() => setEditPassword(false)}>Cancel</button></form>    
  );

  const viewTemplate = (
    <>
      <div className="profile-info">
        <p><strong>Name:</strong> {`${profile.firstname} ${profile.lastname}`}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phone}</p>
        <p><strong>Role:</strong> {profile.roletype == 2 ? "Admin" : "Operator"}</p>
        <p><strong>TeamID:</strong> {profile.teamid}</p>
      </div>


      <div className="profile-settings" >
        <h3> Settings </h3>

        <button className="edit-btn" onClick={() => setEditMode(true)}> Edit Profile </button>
      </div >

      <div className="profile-settings" >
        <h3> Change Password </h3>

        <button className="edit-btn" onClick={() => setEditPassword(true)}> Edit Password </button>
      </div >
    </>
  );


  return (
    <>
      <div className="profile-page">
        <div className="main-layout">

          <Sidebar />

          <div className="content-area">
            <h2>My Profile</h2>

            <ProfileAvatar />
            <div className="profile-header">
              {editMode ? editingTemplate :
              editPassword ? changingPassword 
              :viewTemplate}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}