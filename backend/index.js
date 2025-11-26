//Backend config

const express = require('express'); //Create and express app
const cors = require('cors'); //This allows to use back and front in one computer

require('dotenv').config(); //get info from .env

//One connection per API
//API to get employees info

const employeeRouter = require('./routes/employee')
const scheduleRouter = require('./routes/schedule')
const feedbackRouter = require('./routes/feedback')

//Connection to database
const pool = require('./db');

const app= express(); //Creating a mini express app
const PORT= process.env.PORT || 5001; //Specifying port for backend

//Middleware
app.use(cors());
app.use(express.json());

//Test Postgres connection on startup
pool
    .connect()
    .then((client) => {
        console.log('Connected to PostgreSQL (Neon)');
        client.release();
    })
    .catch((error)=>{
        console.error('PostgreSQL connection error:', error);
    });

//Defining that path that the frontend will sent and how backend will redirect it
app.use('/', employeeRouter);
app.use('/schedule', scheduleRouter);
app.use('/feedback', feedbackRouter);

//Start the server
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});

