import "../styles/Header.css";
export default function Header() {
    const handleSignOut = () => {
        // Signing out
        console.log("User signed out");
    }
    return (
        <header className="header">
            <div className="logo">WasteCo</div>
            <button className="signout-btn" onClick={handleSignOut}>Sign Out</button>
        </header>
    );
}