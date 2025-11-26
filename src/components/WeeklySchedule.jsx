import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/WeeklySchedule.css";

export default function WeeklySchedule({ operatorId }) {
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        if (!operatorId) return;
        axios
            .get(`http://localhost:5001/schedule/${operatorId}/week`)
            .then((response) => setSchedule(response.data))
            .catch((error) => console.error("Error fetching weekly schedule", error));
    }, [operatorId]);

    return (
        <section className="weekly-schedule">
        <h2>Weekly Schedule</h2>
        <div className="schedule-grid">
            {schedule.map((s, index) => (
            <div key={index} className="schedule-item">
                <strong>{s.day}:</strong> {s.shift}
            </div>
            ))}
        </div>
        </section>
    );
}

