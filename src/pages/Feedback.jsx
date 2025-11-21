import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Feedback.css";

export default function Feedback() {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    setFeedback([
      { id: 1, text: "Great teamwork during last shift!", type: "positive" },
      { id: 2, text: "Need to improve punctuality.", type: "negative" },
      { id: 3, text: "Excellent customer service skills.", type: "positive" },
    ]);
  }, []);

  return (
    <div className="feedback-page">
      <div className="main-layout">
        <Sidebar />

        <div className="content-area">
          <h2>Feedback</h2>

          <div className="feedback-list">
            {feedback.map((f) => (
              <div key={f.id} className={`feedback-card ${f.type}`}>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
