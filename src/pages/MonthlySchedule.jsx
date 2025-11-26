import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/MonthlySchedule.css";

export default function MonthlySchedulePage() {
    const { operatorId } = useParams();
    const [schedule, setSchedule] = useState([]);

    //Get schedule
    useEffect(() => {
        //Handle any illegal url
        if (!operatorId) return;

        axios
            .get(`http://localhost:5001/schedule/${operatorId}`)
            .then((response)=> setSchedule(response.data))
            .catch((error) => console.error("Error fetching schedule", error));
    }, [operatorId]);

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
