
import { NavLink, useParams } from "react-router-dom";
import "../styles/Sidebar.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Sidebar() {
    const { operatorId } = useParams();

    useEffect(() => {
        axios
            .get(`http://localhost:5001/profile/${operatorId}`)
            .then((response) => {
                const role = parseInt(response.data.roletype);
                setpermission(role === 2 );
            })
            .catch((error) => console.error("Error fetching employee permission:", error));
    }, [operatorId]);

    const [permission, setpermission] = useState(false);

    const userAdmin =
        (
            <li>
                <NavLink to={`/useradmin/${operatorId}`}>
                    User Administration
                </NavLink>
            </li>);

    return (
        <nav className="sidebar">
            <ul>
                <li>
                    <NavLink to={`/dashboard/${operatorId}`} end>
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to={`/profile/${operatorId}`}>
                        Profile
                    </NavLink>
                </li>
                
                {permission ? userAdmin: ""}
                <li>
                    <NavLink to={`/feedback/${operatorId}`}>
                        Feedback
                    </NavLink>
                </li>
                <li>
                    <NavLink to={`/schedule/${operatorId}`}>
                        Monthly Schedule
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}
