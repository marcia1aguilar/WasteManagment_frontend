
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
    return (
        <nav className="sidebar">
            <ul>
                <li><NavLink to="/" end>Dashboard</NavLink></li>
                <li><NavLink to="/profile">Profile</NavLink></li>
                <li><NavLink to="/feedback">Feedback</NavLink></li>
                <li><NavLink to="/monthly-schedule">Monthly Schedule</NavLink></li>
            </ul>
        </nav>
    );
}
