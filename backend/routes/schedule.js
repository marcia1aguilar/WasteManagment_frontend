const express = require('express'); //Importing express
const router = express.Router(); //Importing router from express
const pool = require('../db'); //Connection to database

//get schedule for a specific employee
router.get('/:uid', async (req, res) => {
    const uid = parseInt(req.params.uid); //ensure it is an integer
    if (Number.isNaN(uid)) {
        return res.status(400).json({ error: 'Invalid UID' });
    }

    try{
        //get all schedules
        const allSchedules = await pool.query(
            'SELECT scheduleid, workdate, starttime, endtime FROM schedule ORDER BY workdate'
        );
        //get just the assigned schedules
        const assigned = await pool.query(
            'SELECT scheduleid FROM is_assigned_to WHERE uid = $1',
            [uid]
        );
        const assignedIds = assigned.rows.map(r => r.scheduleid);

        //Map into object dates
        //Get current year and month dynamically
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // 0-based (0 = Jan, 10 = Nov)

        //Calculate days in current month
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        //Generate all dates for current month
        const allDates = Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(year, month, i + 1);
        return d.toISOString().split('T')[0]; // YYYY-MM-DD
        });

        const formatTime = (t) =>
        new Date(`1970-01-01T${t}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const schedule = allDates.map(date => {
            const row = allSchedules.rows.find(
                r => r.workdate.toISOString().split('T')[0] === date
            );
            if (row && assignedIds.includes(row.scheduleid)) {
                return {
                date,
                shift: `${formatTime(row.starttime)} - ${formatTime(row.endtime)}`
                };
            } else {
                return { date, shift: "Off" };
            }
        });

        res.json(schedule);
    } catch (err){
        console.error('Error fetching schedule:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET weekly schedule for a specific employee
router.get('/:uid/week', async (req, res) => {
    const uid = parseInt(req.params.uid);
    if (Number.isNaN(uid)) {
        return res.status(400).json({ error: 'Invalid UID' });
    }

    try {
        // Calculate start (Monday) and end (Sunday) of current week
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ...
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Monday
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        //Query schedules with JOIN (cast to date for safety)
        const result = await pool.query(
        `SELECT s.scheduleid, s.workdate, s.starttime, s.endtime, i.uid
        FROM schedule s
        LEFT JOIN is_assigned_to i
            ON s.scheduleid = i.scheduleid AND i.uid = $1
        WHERE s.workdate BETWEEN $2::date AND $3::date
        ORDER BY s.workdate`,
        [uid, startOfWeek.toISOString().split('T')[0], endOfWeek.toISOString().split('T')[0]]
        );

        const formatTime = (t) =>
        t ? new Date(`1970-01-01T${t}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

        // Build schedule for each day of the week
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const schedule = days.map((day, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];

        const row = result.rows.find(r => r.workdate.toISOString().split('T')[0] === dateStr);
        if (row && row.uid) {
            return { day, shift: `${formatTime(row.starttime)} - ${formatTime(row.endtime)}` };
        } else {
            return { day, shift: "Off" };
        }
        });

        res.json(schedule);
    } catch (err) {
        console.error("Error fetching weekly schedule:", err.message);
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;
