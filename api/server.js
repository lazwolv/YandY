const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'yandy-users',
    password: 'postgres',
    port: 5432,
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Successfully connected to the database');
    release();
});

app.post('/api/signup', async (req, res) => {
    try {
        const { fullName, phoneNumber, username, password } = req.body;
        console.log(req.body);
        const formattedPhoneNumber = phoneNumber.replace(/\D/g, '').slice(0, 10);
        const query = 'INSERT INTO users (full_name, phone_number, username, password) VALUES ($1, $2, $3, $4)';
        await pool.query(query, [fullName, formattedPhoneNumber, username, password]);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:3000`);
});
app.get('/available-slots', async (req, res) => {
    try {
        const { date, employeeId } = req.query;
        const query = `
            SELECT generate_series(
                $1::timestamp,
                $1::timestamp + interval '1 day' - interval '30 minutes',
                interval '30 minutes'
            ) AS time_slot
            WHERE NOT EXISTS (
                SELECT 1 FROM appointments
                WHERE employee_id = $2
                AND appointment_time = generate_series
            )
        `;
        const result = await pool.query(query, [date, employeeId]);
        res.json(result.rows.map(row => row.time_slot));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching available slots', error: error.message });
    }
});

app.get('/test', (req, res) => {
    res.json({ message: 'Server is running' });
});