const express = require('express'); //Importing express
const router = express.Router(); //Importing router from express
const pool = require('../db'); //Connection to database


function mapRowProfileInfo(row) {
    return {
        firstname: row.firstname,
        lastname: row.lastname,
        birthdate: row.birthdate,
        phone: row.phone,
        email: row.email,
        teamid: row.teamid,
        roletype: row.roletype
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
            //console.log(id)
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
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    if (Number.isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }
    try {
        const result = await pool.query(
            `SELECT firstname, lastname, birthdate, phone, email, teamid, roletype
            FROM Employee
            WHERE uid = $1`,
            [id]
        );

        const employee = result.rows[0];
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        const employeeInfo = mapRowProfileInfo(employee);
        res.status(200).json(employeeInfo);
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ error: error.message });
    }
});



/*
// ADMIN AREA AND PERMISSION:
async function checkAdminPermission(adminId) {
    // Convertir a entero de forma segura
    const id = parseInt(adminId);
    if (isNaN(id)) return false; 
    
    try {
        const result = await pool.query(
            `SELECT roletype FROM Employee WHERE uid = $1`,
            [id]
        );
        // Si no hay fila o el rol no es '2' (Admin)
        return result.rowCount > 0 && result.rows[0].roletype === '2';
    } catch (error) {
        console.error("Permission check failed:", error);
        return false;
    }
}

// Ruta: /profile/useradmin/:targetId
router.get('/useradmin/:targetId', async (req, res) => {
    // ASUNCIÓN: Aquí deberías verificar el ID del admin que hace la petición.
    // Como tu frontend no lo está enviando aún, lo haremos simple por ahora,
    // pero la seguridad es clave.
    const targetId = parseInt(req.params.targetId);

    if (Number.isNaN(targetId)) {
        return res.status(400).json({ message: 'Invalid target ID' });
    }

    try {
        const result = await pool.query(
            `SELECT firstname, lastname, birthdate, phone, email, teamid, roletype
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

*/






///////

//POST CREATION EMPLOYEE PROFILE 
router.post('/', async (req, res) => {
    const { firstname, lastname, birthdate, phone, email, teamid, roletype } = req.body;


    if (!firstname?.trim() || !lastname?.trim() || !email?.trim()) { //? in case non exist
        return res.status(400).json({ message: "Firstname, lastname, email are required" });
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
router.patch('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    if (Number.isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    //To update data container
    const { firstname, lastname, birthdate, phone, email, teamid, password, roletype } = req.body; //posibilidad de actualizar sólo para operador.

    try {
        const permisionReq = await pool.query(
            `SELECT roletype 
            FROM Employee
            WHERE uid = $1`,
            [id]
        );
        //Enable to update user if profile is Admin.
        const permission = permisionReq.rows[0].roletype
        permission != "2" ? res.status(403).json({ error: 'Forbidden request.' }) : "";

    }
    catch (error) {
        console.error('Error fetching employee1:', error);
        res.status(500).json({ error: error.message });
    }


    try {
        const existingResult = await pool.query(
            `SELECT firstname, lastname, birthdate, phone, email, teamid, password, roletype 
            FROM Employee
            WHERE uid = $1`,
            [id]
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
            WHERE uid = $9 RETURNING uid, firstname, lastname, phone, email, teamid, roletype `, // I'm not returning password to keep confidencial regards frontend.
            [updateFirstName, updateLastName, updateBirthDate, updatePhone, updateEmail, updatePassword, updateTeamid, updateRoleType, id]
        );

        const employeeInfo = mapRowProfileInfo(updateResult.rows[0]);
        res.status(200).json(employeeInfo);

    } catch (error) {
        console.error('Error fetching employee2:', error);
        res.status(500).json({ error: error.message });
    }
});



//To reset password by admin.
router.patch("/:id/resetpassword", async (req, res) => {
    try {
        const defaultPassword = "1234";

        const queryReset = `
      UPDATE employee
      SET password = $1
      WHERE uid = $2
      RETURNING uid; 
    `;
        //not returning password for confidenciality

        const result = await pool.query(queryReset, [defaultPassword, req.params.id]);

        res.json({ employee: result.rows[0], message: "Password reset" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error resetting password");
    }
});


module.exports = router;