const express = require('express'); //Importing express
const router = express.Router(); //Importing router from express
const pool = require('../db'); //Connection to database

// GET feedback for a specific operator, including average score
router.get('/:operatorId', async (req, res) => {
    const operatorId = parseInt(req.params.operatorId);
    if (Number.isNaN(operatorId)) {
        return res.status(400).json({ error: 'Invalid operatorId' });
    }

    try {
        // Query all feedback rows for this operator
        const result = await pool.query(
        `SELECT fid, feedbackdate, feedbackcomment, performancescore, operatorteamid
        FROM feedback
        WHERE operatoruid = $1
        ORDER BY feedbackdate`,
        [operatorId]
        );

        // Calculate average score
        let avgScore = null;
        if (result.rows.length > 0) {
        const total = result.rows.reduce((sum, f) => sum + f.performancescore, 0);
        avgScore = total / result.rows.length;
        }

        // Return both feedback list and average
        res.json({
        feedback: result.rows,
        averageScore: avgScore
        });
    } catch (err) {
        console.error("Error fetching feedback:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET average score for a specific team
router.get('/team-average/:teamId', async (req, res) => {
    const teamId = parseInt(req.params.teamId);
    if (Number.isNaN(teamId)) {
        return res.status(400).json({ error: 'Invalid teamId' });
    }

    try {
        const result = await pool.query(
        `SELECT AVG(performancescore) AS team_avg
        FROM feedback
        WHERE operatorteamid = $1`,
        [teamId]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error fetching team average:", err.message);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;