import { useEffect, useState } from "react";
import CompanyBanner from "../components/CompanyBanner";
import FeedbackCard from "../components/FeedbackCard";
import NextShiftCard from "../components/NextShiftCard";
import ProfileAvatar from "../components/ProfileAvatar";
import Sidebar from "../components/Sidebar";
import WeeklySchedule from "../components/WeeklySchedule";
import "../styles/Dashboard.css";


export default function Dashboard() {
    //Trigger animation only once when component mounts
    const [animate, setAnimate] = useState(false);
    useEffect(() => {
        setAnimate(true);
    }, []);

    return (
    <div className={`dashboard ${animate ? "fade-in" : ""}`}>
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