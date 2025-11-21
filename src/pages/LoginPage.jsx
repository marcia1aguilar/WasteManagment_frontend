// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

export default function LoginPage() {
    const [operatorId, setOperatorId] = useState("");
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        if (operatorId.trim()) {
        navigate(`/dashboard/${operatorId}`);
        }
    }

    return (
        <div className="login-page">
        <h2>Operator Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="operatorId">Enter Operator ID:</label>
            <input
            type="text"
            id="operatorId"
            value={operatorId}
            onChange={(e) => setOperatorId(e.target.value)}
            placeholder="e.g. 12345"
            />
            <button type="submit">Login</button>
        </form>
        </div>
    );
}
