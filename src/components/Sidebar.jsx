
import { NavLink, useParams } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
    const { operatorId } = useParams();

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
            <li>
            <NavLink to={`/feedback/${operatorId}`}>
                Feedback
            </NavLink>
            </li>
            <li>
            <NavLink to={`/monthly-schedule/${operatorId}`}>
                Monthly Schedule
            </NavLink>
            </li>
        </ul>
    </nav>
    );
}
