import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/FeedbackCard.css";

export default function FeedbackCard({ operatorId }) {
    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        if (!operatorId) return;
        axios.get(`http://localhost:5001/feedback/${operatorId}`)
        .then(res => {
            setFeedback(res.data.feedback);
        })
        .catch(err => console.error("Error fetching feedback", err));
    }, [operatorId]);

    const recentFeedback= feedback.slice(-2);

    return (
        <div className="feedback-card">
        <h3>Recent Feedback</h3>
        <div className="feedback-items">
            {recentFeedback.length === 0 ? (
            <p>No recent feedback</p>
            ) : (
            recentFeedback.map(f => (
                <div key={f.fid} className={`feedback-card ${f.performancescore >= 3 ? "positive" : "negative"}`}>
                    <p>{f.feedbackcomment}</p>
                </div>
            ))
            )}
        </div>
        </div>
    );
}
