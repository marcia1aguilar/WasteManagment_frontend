import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/NextShiftCard.css";

export default function NextShiftCard( operatorId ) {
    const [nextShift, setNextShift] = useState(null);

    useEffect(() => {
        if (!operatorId) return;
        axios
            .get(`http://localhost:5001/schedule/${operatorId}/next`)
            .then((response) => setNextShift(response.data))
            .catch((error) => console.error("Error fetching weekly schedule", error));
    }, [operatorId]);

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
