const express = require('express'); //Importing express
const router = express.Router(); //Importing router from express
const pool = require('../db'); //Connection to database
const { password } = require('pg/lib/defaults');


function mapRowProfileInfo(row) {
    return {
        firstname: row.firstname,
        lastname: row.lastname,
        birthdate: row.birthdate,
        phone: row.phone,
        email: row.email,
        teamid: row.teamid,
        roletype: row.roletype,
        uid : row.uid
    };
}

//Login Authentication
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            `SELECT uid
            FROM Employee
            WHERE email = $1 AND password =$2`,
            [email, password]
        );

        if (result.rowCount === 1) {
            const id = result.rows[0].uid
            res.status(200).json({ message: "Login successful", id: id });
        }

        else res.status(401).json({ message: "Invalid email or password2" });
    }
    catch (error) {
        console.error("Error login:", error);
        res.status(500).json({ message: "Internal Server Error " });
    }
}
);

//Get info for employee profile
router.get('/profile/:operatorId', async (req, res) => {
    const operatorId = parseInt(req.params.operatorId)
    if (Number.isNaN(operatorId)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }
    try {
        const result = await pool.query(
            `SELECT uid, firstname, lastname, birthdate, phone, email, teamid, roletype
            FROM Employee
            WHERE uid = $1`,
            [operatorId]
        );

        const employee = result.rows[0];
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        const employeeInfo = mapRowProfileInfo(employee);
        res.status(200).json(employeeInfo);
    } catch (error) {
        console.error('Error fetching employee4:', error);
        res.status(500).json({ error: error.message });
    }
});

router.patch('/profile/:operatorId', async (req, res) => {
    //To update data container
    const { phone, email, password } = req.body; //posibilidad de actualizar sólo para operador.

    //Request for exisiting info from targetId.

    const targetId = parseInt(req.params.operatorId)
    if (Number.isNaN(targetId)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    try {
        const existingResult = await pool.query(
            `SELECT firstname, lastname, birthdate, phone, email, teamid, password, roletype 
            FROM Employee
            WHERE uid = $1`,
            [targetId]
        );

        //rowCount is a key in pool.query object
        if (existingResult.rowCount === 0) return res.status(404).json({ error: 'Employee not found' });

        const existing = existingResult.rows[0];

        const updatePhone = phone || existing.phone;
        const updateEmail = email || existing.email;
        const updatePassword = password || existing.password;

        const updateResult = await pool.query(
            `UPDATE Employee SET 
            phone = $1, 
            email = $2,
            password =$3
            WHERE uid = $4 RETURNING firstname, lastname, birthdate, phone, email, teamid, roletype `, // I'm not returning password to keep confidencial regards frontend.
            [updatePhone, updateEmail, updatePassword, targetId]
        );

        const employeeInfo = mapRowProfileInfo(updateResult.rows[0]);
        res.status(200).json(employeeInfo);

    } catch (error) {
        console.error('Error fetching employee2:', error);
        res.status(500).json({ error: error.message });
    }
});



// ADMIN AREA AND PERMISSION:
async function checkAdminPermission(operatorId) {

    const id = parseInt(operatorId);
    if (isNaN(id)) return false;

    try {
        const result = await pool.query(
            `SELECT roletype FROM Employee WHERE uid = $1`,
            [id]
        );

        return result.rows[0].roletype === 2;

    } catch (error) {
        console.error("Permission check failed:", error);
        return false;
    }
}

// Ruta: useradmin/:operatorId/:targetId
router.get('/useradmin/:operatorId/:targetId', async (req, res) => {

    const adminId = req.params.operatorId;

    const targetId = parseInt(req.params.targetId);

    const isAdmin = await checkAdminPermission(adminId);
    if (!isAdmin) {
        return res.status(403).json({ message: "Forbidden access: Admin roletype required." });
    }

    if (Number.isNaN(targetId)) {
        return res.status(400).json({ message: 'Invalid target ID' });
    }


    try {
        const result = await pool.query(
            `SELECT uid, firstname, lastname, birthdate, phone, email, teamid, roletype
            FROM Employee
            WHERE uid = $1`,
            [targetId]
        );

        const employee = result.rows[0];
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        const employeeInfo = mapRowProfileInfo(employee);
        res.status(200).json(employeeInfo);
    } catch (error) {
        console.error('Error fetching employee for admin:', error);
        res.status(500).json({ error: error.message });
    }
});



//POST CREATION EMPLOYEE PROFILE 
router.post('/useradmin/:operatorId/', async (req, res) => {
    let { firstname, lastname, birthdate, phone, email, teamid, roletype } = req.body;
    //Formatted for database:

    birthdate = birthdate || null
    phone = phone || null
    teamid = teamid || null;

    //Admin Validation:
    const adminId = req.params.operatorId;
    const isAdmin = await checkAdminPermission(adminId);
    if (!isAdmin) {
        return res.status(403).json({ message: "Forbidden access: Admin roletype required." });
    }



    if (!firstname?.trim() || !lastname?.trim() || !email?.trim() || roletype < 1 || roletype > 2) { //? in case non exist
        return res.status(400).json({ message: "Firstname, lastname, email, and correct roletype are required" });
    }

    const passwordDefault = "1234"
    try {
        const result = await pool.query(`
            INSERT INTO Employee (firstname, lastname, birthdate, phone, email, teamid, password, roletype)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING uid, firstname, lastname, phone, email, teamid, roletype
        `,
            [firstname, lastname, birthdate, phone, email, teamid, passwordDefault, roletype]);

        const employee = result.rows[0];

        const employeeInfo = mapRowProfileInfo(employee);
        res.status(201).json(employeeInfo);

    } catch (error) {
        console.error("Error creating employee:", error);
        res.status(500).json({ message: "Error creating employee" });
    }
});


//UPDATE EMPLOYEE PROFILE (FULL FACULTIES)
router.patch('/useradmin/:operatorId/:targetId', async (req, res) => {
    //To update data container
    const { firstname, lastname, birthdate, phone, email, teamid, password, roletype } = req.body; //posibilidad de actualizar sólo para operador.

    //Admin Validation
    const adminId = req.params.operatorId;
    const isAdmin = await checkAdminPermission(adminId);
    if (!isAdmin) {
        return res.status(403).json({ message: "Forbidden access: Admin roletype required." });
    }

    //Request for exisiting info from targetId.

    const targetId = parseInt(req.params.targetId)
    if (Number.isNaN(targetId)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    try {
        const existingResult = await pool.query(
            `SELECT firstname, lastname, birthdate, phone, email, teamid, password, roletype 
            FROM Employee
            WHERE uid = $1`,
            [targetId]
        );

        //rowCount is a key in pool.query object
        if (existingResult.rowCount === 0) return res.status(404).json({ error: 'Employee not found' });

        const existing = existingResult.rows[0];

        const updateFirstName = firstname || existing.firstname;
        const updateLastName = lastname || existing.lastname;
        const updateBirthDate = birthdate || existing.birthdate;
        const updatePhone = phone || existing.phone;
        const updateEmail = email || existing.email;
        const updatePassword = password || existing.password;
        const updateTeamid = teamid || existing.teamid;
        const updateRoleType = roletype || existing.roletype;

        const updateResult = await pool.query(
            `UPDATE Employee SET 
            firstname = $1, 
            lastname = $2, 
            birthdate = $3, 
            phone = $4, 
            email = $5, 
            password = $6, 
            teamid = $7,
            roletype = $8
            WHERE uid = $9 RETURNING uid, firstname, lastname, birthdate, phone, email, teamid, roletype `, // I'm not returning password to keep confidencial regards frontend.
            [updateFirstName, updateLastName, updateBirthDate, updatePhone, updateEmail, updatePassword, updateTeamid, updateRoleType, targetId]
        );

        const employeeInfo = mapRowProfileInfo(updateResult.rows[0]);
        res.status(200).json(employeeInfo);

    } catch (error) {
        console.error('Error fetching employee3:', error);
        res.status(500).json({ error: error.message });
    }
});



//To reset password by admin.
router.patch("/useradmin/:operatorId/:targetId/resetpassword", async (req, res) => {

    //Admin Validation
    const adminId = req.params.operatorId;
    const isAdmin = await checkAdminPermission(adminId);
    if (!isAdmin) {
        return res.status(403).json({ message: "Forbidden access: Admin roletype required." });
    }
    //-

    try {
        const defaultPassword = "1234";

        const queryReset = `
      UPDATE employee
      SET password = $1
      WHERE uid = $2
      RETURNING uid`; //not returning password for confidenciality

        const result = await pool.query(queryReset, [defaultPassword, req.params.operatorId]);

        res.json({ employee: result.rows[0], message: "Password reset" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error resetting password");
    }
});

router.delete('/useradmin/:operatorId/:targetId', async (req, res) => {

    const adminId = req.params.operatorId;

    const targetId = parseInt(req.params.targetId);

    const isAdmin = await checkAdminPermission(adminId);
    if (!isAdmin) {
        return res.status(403).json({ message: "Forbidden access: Admin roletype required." });
    }

    if (Number.isNaN(targetId)) {
        return res.status(400).json({ message: 'Invalid target ID' });
    }


    try {
        const result = await pool.query(
            `DELETE FROM Employee
            WHERE uid = $1`,
            [targetId]
        );

        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting employee for admin:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;