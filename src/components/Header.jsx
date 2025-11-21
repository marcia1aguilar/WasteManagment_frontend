import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
export default function Header() {
    const navigate = useNavigate();
    const handleSignOut = () => {
        localStorage.removeItem("operatorId");
        navigate("/");
    }

    //Dark mode
    const[darkMode, setDarkMode] = useState(false);
    useEffect(() => {
        const savedMode = localStorage.getItem("darkMode");
        if (savedMode === "true") {
        setDarkMode(true);
        document.body.classList.add("dark-mode");
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);

        if (newMode) {
        document.body.classList.add("dark-mode");
        } else {
        document.body.classList.remove("dark-mode");
        }

        localStorage.setItem("darkMode", newMode);
    };
    return (
        <header className="header">
            <div className="logo">WasteCo</div>
            <div className="btns">
            <button className="darkmode-btn" onClick={toggleDarkMode}>{darkMode ? "Light Mode" : "Dark Mode"}</button>
            <button className="signout-btn" onClick={handleSignOut}>Sign Out</button>
            </div>
        </header>
    );
}