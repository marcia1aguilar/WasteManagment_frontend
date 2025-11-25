import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileAvatar from "../components/ProfileAvatar";
import Sidebar from "../components/Sidebar";
import "../styles/Profile.css";

export default function UserAdmin() {
  const { userId } = useParams(); // /profile/:operatorId


  //GET employee info
  useEffect(() => {
    axios
      .get(`http://localhost:5001/id/useradmin/${userId}`)
      .then((response) => {
        setProfile(response.data);
        setFormData({
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          birthdate: response.data.birthdate,
          phone: response.data.phone,
          email: response.data.email,
          teamid: response.data.teamid,
          roletype: response.data.roletype

        });
      })
      .catch((error) => console.error("Error fetching employee:", error));
  }, [userId]);

  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({ firstname: "", lastname: "", birthdate: "", phone: "", email: "", teamid: "", roletype: "" });
  const [editMode, setEditMode] = useState(false);


  if (!profile) return <p>Loading...</p>;



  //PATCH employee info. 
  function handleUpdate(e) {
    e.preventDefault();

    const updatedData = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      birthdate: formData.birthdate,
      phone: formData.phone,
      email: formData.email,
      teamid: formData.teamid,
      roletype: formData.roletype
    };

    axios
      .patch(`http://localhost:5001/:id/useradmin/${userId}`, updatedData)
      .then((response) => {
        setProfile(response.data);
        setEditMode(false);
        setFormData(response.data);
      })
      .catch((error) => console.error("Error updating employee:", error));
  }

  const viewTemplate = (
    <form onSubmit={(e) =>
      handleUpdate(e)} className="edit-form">
      <label>
        First Name:
        <input
          type="text"
          name="firstName"
          value={formData.firstname}
          onChange={(e) =>
            setFormData({ ...formData, firstname: e.target.value })
          }
        />
      </label>
      <label>
        Last Name:
        <input
          type="text"
          name="lastName"
          value={formData.lastname}
          onChange={(e) =>
            setFormData({ ...formData, lastname: e.target.value })
          }
        />
      </label>

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

      <label>
        Birth Date:
        <input
          type="text"
          name="birthdate"
          value={formData.birthdate}
          onChange={(e) =>
            setFormData({ ...formData, birthdate: e.target.value })
          }
        />
      </label>
      <label>
        TeamID:
        <input
          type="number"
          name="teamid"
          value={formData.teamid}
          onChange={(e) =>
            setFormData({ ...formData, teamid: e.target.value })
          }
        />
      </label>
      <label>
        Role:
        <input
          type="number"
          name="roletype"
          value={formData.roletype}
          onChange={(e) =>
            setFormData({ ...formData, roletype: e.target.value })
          }
        />
      </label>
      <button type="submit" >Save</button>
      <button type="button" onClick={() => setEditMode(false)}>
        Cancel
      </button>
    </form>
  );

  const  updatingUser = (
    <>
      <div className="profile-info">
        <p><strong>Name:</strong> {`${profile.firstname} ${profile.lastname}`}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phone}</p>
        <p><strong>Role:</strong> {profile.roletype == 2 ? "Admin" : "Operator"}</p>
        <p><strong>TeamID:</strong> {profile.teamid}</p>
      </div>


      <div className="profile-settings" >
        <h3>Update User</h3>

        <button className="edit-btn" onClick={() => setEditMode(true)}> Edit Profile </button>
        {editMode ? viewTemplate:""}
      </div >
    </>
  );


  function handlePasswordReset() {
    axios
      .patch(`http://localhost:5001/:id/useradmin/${userId}/resetpassword`)
      .then(() => alert("Password reset to default value"))
      .catch((err) => console.error("Error resetting password:", err));
  }

  return (
    <>
      <div className="profile-page">
        <div className="main-layout">

          <Sidebar />

          <div className="content-area">
            <h2>User Administration</h2>

            <ProfileAvatar />
            <div className="profile-header">
              {editMode ? updatingUser : viewTemplate}
            </div>
            <button className="password-btn" onClick={() => handlePasswordReset()}> Reset Password</button>
          </div>
        </div>
      </div>
    </>
  );
}