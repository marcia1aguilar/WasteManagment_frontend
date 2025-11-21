import { useEffect, useState } from "react";
import "../styles/FeedbackCard.css";

export default function FeedbackCard() {
    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        setFeedback([
        { id: 1, text: "Great teamwork!", type: "positive" },
        { id: 2, text: "Need to improve punctuality.", type: "negative" },
        ]);
    }, []);

    return (
        <div className="feedback-card">
        <h3>Recent Feedback</h3>
        {feedback.map(f => (
            <p key={f.id} className={f.type}>{f.text}</p>
        ))}
        </div>
    );
}