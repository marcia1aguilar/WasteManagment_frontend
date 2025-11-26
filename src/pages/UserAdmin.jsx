import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileAvatar from "../components/ProfileAvatar";
import Sidebar from "../components/Sidebar";
import "../styles/Profile.css";

export default function UserAdmin() {
  const { operatorId } = useParams(); // useradmin/:operatorId DEBEN TENER Mismo Nombre

  const [targetId, setTargetId] = useState("");
  const [profileTargetId, setProfileTargetId] = useState("");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    birthdate: "",
    phone: "",
    email: "",
    teamid: 0,
    roletype: 0,
    uid: 0
  });
  const [editMode, setEditMode] = useState(false);
  const [createMode, setCreateMode] = useState(false);

  const cleanFormData = ({
    uid: "",
    firstname: "",
    lastname: "",
    birthdate: "",
    phone: "",
    email: "",
    teamid: "",
    roletype: ""
  });


  //GET employee targetId info
  function getProfileTargetId(operatorId, targetId) {
    if (!targetId) {
      return;
    }

    axios
      .get(`http://localhost:5001/useradmin/${operatorId}/${targetId}`)
      .then((response) => {
        setFormData({
          uid: response.data.uid,
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          birthdate: response.data.birthdate,
          phone: response.data.phone,
          email: response.data.email,
          teamid: response.data.teamid,
          roletype: response.data.roletype,
        });
        console.log(response.data);
        setProfileTargetId(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          alert(`Employee ID ${targetId} not found.`);
          setFormData(cleanFormData);
        }
        console.error("Error fetching employee:", error);
      })
  }

  function deleteProfileTargetId(operatorId, targetId) {
    setFormData(cleanFormData);
    axios
      .delete(`http://localhost:5001/useradmin/${operatorId}/${targetId}`)
      .then((response) => {
        setProfileTargetId(cleanFormData);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          alert(`Employee ID ${targetId} not found.`);
        }
        console.error("Error fetching employee:", error);
      })
  }


  function handleCreate(e) {
    e.preventDefault();

    const createData = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      birthdate: formData.birthdate,
      phone: formData.phone,
      email: formData.email,
      teamid: formData.teamid,
      roletype: formData.roletype

    };
    axios
      .post(`http://localhost:5001/useradmin/${operatorId}`, createData)
      .then((response) => {
        setCreateMode(false);
        setFormData(response.data);
        setProfileTargetId(response.data);

      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert("Firstname, lastname, email, teamID and correct roletype are required");
        } else if (error.response && error.response.status === 403) {
          alert("Access Denied. Ask your Admin for permission");
        } else {
          console.error("Error fetching employee:", error);
          alert("An unexpected error occurred while fetching the profile.");
        }
        console.error("Error creating employee:", error)});
  }

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
      roletype: formData.roletype,
      uid:formData.uid
    };

    axios
      .patch(`http://localhost:5001/useradmin/${operatorId}/${targetId}`, updatedData)
      .then((response) => {
        setEditMode(false);
        setFormData(response.data);
        setProfileTargetId(response.data);

      })
      .catch((error) => console.error("Error updating employee:", error));
  }


  function handlePasswordReset() {
    axios
      .patch(`http://localhost:5001/useradmin/${operatorId}/${targetId}/resetpassword`)
      .then(() => alert("Password reset to default value"))
      .catch((err) => console.error("Error resetting password:", err));
  }

  const updateView = (<>
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
          type="date"
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
        <select name="roletype" id="roletype" value={formData.roletype}
          onChange={(e) => setFormData({ ...formData, roletype: e.target.value })}>
          <option value="">Select Role</option>
          <option value="1">Operator</option>
          <option value="2">Admin</option></select>
      </label>
      <button type="submit" className="edit-btn" >Save</button>
      <button type="button" className="edit-btn" onClick={() => setEditMode(false)}>
        Cancel
      </button></form>
  </>
  );

  const createView = (
    <>
      <form onSubmit={(e) => {
        setFormData(cleanFormData);
        handleCreate(e);
      }} className="edit-form">
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
            type="date"
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
          <select name="roletype" id="roletype" value={formData.roletype}
            onChange={(e) => setFormData({ ...formData, roletype: e.target.value })}>
            <option value="">Select Role</option>
            <option value="1">Operator</option>
            <option value="2">Admin</option></select>
        </label>
        <button type="submit" className="edit-btn" >Create User </button>
        <button type="button" className="edit-btn" onClick={() => setCreateMode(false)}>
          Cancel
        </button></form>
    </>
  );


  const targetUser = (
    <>
      <div className="profile-info">
        <p><strong>Name:</strong> {(`${profileTargetId.firstname} ${profileTargetId.lastname}`) || ""}</p>
        <p><strong>Email:</strong> {profileTargetId.email || ""}</p>
        <p><strong>Phone:</strong> {profileTargetId.phone || ""}</p>
        <p><strong>Role:</strong> {profileTargetId.roletype == 2 ? "Admin" : profileTargetId.roletype == 1 ? "Operator" : ""}</p>
        <p><strong>TeamID:</strong> {profileTargetId.teamid || ""}</p>
        <p><strong>ID:</strong> {profileTargetId.uid || ""}</p>
      </div>

      <div className="profile-settings" >
        <button className="edit-btn" onClick={() => setEditMode(true)}> Edit Profile </button>
        <button className="password-btn" onClick={() => handlePasswordReset(operatorId, targetId)}> Reset Password</button>

      </div >
    </>
  );

  return (
    <>
      <div className="profile-page">
        <div className="main-layout">

          <Sidebar />

          <div className="content-area">
            <h2>User Administration</h2>

            <ProfileAvatar />
            <div className="profile-header">
              <label>
                Info Request:
                <input
                  type="number"
                  name="targetId"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                />
              </label>
              <div>
                <button className="edit-btn" onClick={() => {getProfileTargetId(operatorId, targetId);setCreateMode(false)}} > Get Profile</button>
                <button className="edit-btn" onClick={() => deleteProfileTargetId(operatorId, targetId)} > Delete Profile</button>

              </div>
            </div>
            {editMode ? updateView : !profileTargetId ? "" : !createMode?targetUser:""}


            <div className="profile-header">
              <div>
                <button className="edit-btn" onClick={() => { setCreateMode(true);setEditMode(false);setFormData(cleanFormData); }} > Create New Profile</button>
                {createMode ? createView : ""}

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}