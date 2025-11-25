import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/LoginPage.css";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

   function handleSubmit(e) {
    e.preventDefault();

    axios.post("http://localhost:5001/profile/login", {
        email:email,
        password:password,
    })
    .then((res) => {
        const id = res.data.id;
        navigate(`/dashboard/${id}`);
    })
    .catch((err) => {
        console.error("Login failed:", err);
        setError("Invalid email or password1");
    });
}

    return (
        <div className="login-page">
            <h2>Operator Login</h2>

            <form onSubmit={handleSubmit} className="login-form">

                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {error ? error:""}
        </div>
    );
}
