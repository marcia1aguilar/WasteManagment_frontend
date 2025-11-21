import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/MonthlySchedule.css";

export default function MonthlySchedulePage() {
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        setSchedule([
        { date: "2025-11-01", shift: "Off" },
        { date: "2025-11-02", shift: "10 AM - 4 PM" },
        { date: "2025-11-03", shift: "9 AM - 5 PM" },
        { date: "2025-11-04", shift: "1 PM - 9 PM" },
        { date: "2025-11-05", shift: "Off" },
        { date: "2025-11-06", shift: "7 AM - 3 PM" },
        { date: "2025-11-07", shift: "9 AM - 5 PM" },
        { date: "2025-11-08", shift: "Off" },
        { date: "2025-11-09", shift: "10 AM - 4 PM" },
        { date: "2025-11-10", shift: "9 AM - 5 PM" },
        { date: "2025-11-11", shift: "1 PM - 9 PM" },
        { date: "2025-11-12", shift: "Off" },
        { date: "2025-11-13", shift: "7 AM - 3 PM" },
        { date: "2025-11-14", shift: "9 AM - 5 PM" },
        { date: "2025-11-15", shift: "Off" },
        { date: "2025-11-16", shift: "10 AM - 4 PM" },
        { date: "2025-11-17", shift: "9 AM - 5 PM" },
        { date: "2025-11-18", shift: "1 PM - 9 PM" },
        { date: "2025-11-19", shift: "Off" },
        { date: "2025-11-20", shift: "7 AM - 3 PM" },
        { date: "2025-11-21", shift: "9 AM - 5 PM" },
        { date: "2025-11-22", shift: "Off" },
        { date: "2025-11-23", shift: "10 AM - 4 PM" },
        { date: "2025-11-24", shift: "9 AM - 5 PM" },
        { date: "2025-11-25", shift: "1 PM - 9 PM" },
        { date: "2025-11-26", shift: "Off" },
        { date: "2025-11-27", shift: "7 AM - 3 PM" },
        { date: "2025-11-28", shift: "9 AM - 5 PM" },
        { date: "2025-11-29", shift: "Off" },
        { date: "2025-11-30", shift: "10 AM - 4 PM" },
        ]);
    }, []);

    const getDay = (dateStr) => new Date(dateStr).getDate();

    return (
        <div className="monthly-schedule-page">
        <div className="main-layout">
            <Sidebar />
            <div className="content-area">
            <h2>Monthly Schedule</h2>
            <div className="calendar-grid">
                {schedule.map((s, index) => (
                <div key={index} className="calendar-day">
                    <div className="day-number">{getDay(s.date)}</div>
                    <div className="shift-info">{s.shift}</div>
                </div>
                ))}
            </div>
            </div>
        </div>
        </div>
    );
}
