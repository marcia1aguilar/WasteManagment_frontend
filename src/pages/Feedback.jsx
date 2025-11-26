import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/Feedback.css";

export default function Feedback() {
  const { operatorId } = useParams();
  const [feedback, setFeedback] = useState([]);
  const [avgScore, setAvgScore] = useState(null);
  const [teamAvg, setTeamAvg] = useState(null);
  const [teamId, setTeamId] = useState(null);

  useEffect(() => {
    if (!operatorId) return;

    axios.get(`http://localhost:5001/feedback/${operatorId}`)
      .then(res => {
        setFeedback(res.data.feedback);
        setAvgScore(res.data.averageScore);

        if (res.data.feedback.length > 0) {
          const tid = res.data.feedback[0].operatorteamid;
          setTeamId(tid);

          axios.get(`http://localhost:5001/feedback/team-average/${tid}`)
            .then(r => setTeamAvg(r.data.team_avg))
            .catch(err => console.error("Error fetching team average", err));
        }
      })
      .catch(err => console.error("Error fetching feedback", err));
  }, [operatorId]);

  return (
    <div className="feedback-page">
      <div className="main-layout">
        <Sidebar />
        <div className="content-area">
          <h2>Feedback</h2>

          <div className="feedback-list">
            {feedback.length === 0 ? (
              <p>No feedback yet</p>
            ) : (
              feedback.map(f => (
                <div key={f.fid} className={`feedback-card ${f.performancescore >= 3 ? "positive" : "negative"}`}>
                  <p><strong>Date:</strong> {f.feedbackdate}</p>
                  <p><strong>Score:</strong> {f.performancescore}</p>
                  <p>{f.feedbackcomment}</p>
                </div>
              ))
            )}
          </div>

          {avgScore !== null && (
            <div className="feedback-average">
              <h3>Average Performance Score (this operator): {avgScore.toFixed(2)}</h3>
            </div>
          )}

          {teamAvg !== null && (
            <div className="team-average">
              <h3>Average Team Score (Team {teamId}): {Number(teamAvg).toFixed(2)}</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

