import { useEffect, useState } from "react";
import "../styles/NextShiftCard.css";

export default function NextShiftCard() {
    const [nextShift, setNextShift] = useState(null);

    useEffect(() => {
        setNextShift({ day: "Monday", time: "9 AM - 5 PM" });
    }, []);

    return (
        <div className="next-shift-card">
        <h3>Next Shift</h3>
        {nextShift ? (
            <p>{nextShift.day} — {nextShift.time}</p>
        ) : (
            <p>No upcoming shifts</p>
        )}
        </div>
    );
}
