import { useEffect, useState } from "react";
import "../styles/WeeklySchedule.css";

export default function WeeklySchedule() {
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        setSchedule([
        { day: "Monday", shift: "9 AM - 5 PM" },
        { day: "Tuesday", shift: "Off" },
        { day: "Wednesday", shift: "1 PM - 9 PM" },
        { day: "Thursday", shift: "7 AM - 3 PM" },
        { day: "Friday", shift: "9 AM - 5 PM" },
        ]);
    }, []);

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

