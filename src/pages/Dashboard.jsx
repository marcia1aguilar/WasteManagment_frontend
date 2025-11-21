import CompanyBanner from "../components/CompanyBanner";
import FeedbackCard from "../components/FeedbackCard";
import NextShiftCard from "../components/NextShiftCard";
import ProfileAvatar from "../components/ProfileAvatar";
import Sidebar from "../components/Sidebar";
import WeeklySchedule from "../components/WeeklySchedule";
import "../styles/Dashboard.css";

export default function Dashboard() {
    return (
    <div className="dashboard">
        <div className="main-layout">
            <Sidebar />
            <div className="content-area">
            <div className="top-section">
                <ProfileAvatar />
                <CompanyBanner />
            </div>
            <WeeklySchedule />
            <div className="side-cards">
                <NextShiftCard />
                <FeedbackCard />
            </div>
            </div>
        </div>
    </div>
    );
}