const express=require('express'); //Importing express
const router= express.Router(); //Importing router from express
const pool= require('../db'); //Connection to database

//Function to map profile info for employee
function mapRowProfileInfo(row){
    return{
        name: row.firstname + " " + row.lastname,
        phone: row.phone,
        role: row.role,
    };
}

//Get info for employee
router.get('/:id', async(req, res)=>{
    const id=parseInt(req.params.id)
    if (Number.isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }
    try{
        const result = await pool.query(
            `SELECT firstname, lastname, phone,
                CASE 
                    WHEN teamid = 1 THEN 'Operator'
                    WHEN teamid = 2 THEN 'Admin'
                    ELSE 'Employee'
                END AS role
            FROM Employee
            WHERE uid = $1`,
            [id]
        );

        const employee =result.rows[0];
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        const employeeInfo = mapRowProfileInfo(employee);
        res.status(200).json(employeeInfo);
    } catch(error){
        console.error('Error fetching employee:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports= router;