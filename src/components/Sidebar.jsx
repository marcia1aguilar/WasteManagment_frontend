import "../styles/Sidebar.css";

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <nav>
                <ul>
                    <li>Weekly Schedule</li>
                    <li>Next Shift</li>
                    <li>Feedback</li>
                </ul>
            </nav>
        </aside>
    );
}