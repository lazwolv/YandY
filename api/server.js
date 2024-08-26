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

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await pool.query(query, [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = result.rows[0];
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        res.status(200).json({
            message: 'Login successful',
            user: {
                username: user.username,
                fullName: user.full_name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
});

app.get('/api/team-members', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM team_members');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/available-slots', async (req, res) => {
    try {
        const { teamMemberId, date } = req.query;
        const startTime = new Date(`${date}T09:00:00`);
        const endTime = new Date(`${date}T17:00:00`);
        const slots = [];

        while (startTime < endTime) {
            const slotEnd = new Date(startTime.getTime() + 30 * 60000);
            const query = `
                SELECT COUNT(*) FROM appointments 
                WHERE team_member_id = $1 
                AND appointment_time = $2
            `;
            const result = await pool.query(query, [teamMemberId, startTime]);
            if (result.rows[0].count === '0') {
                slots.push(startTime.toISOString());
            }
            startTime.setTime(slotEnd.getTime());
        }
        res.json(slots);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/book-appointment', async (req, res) => {
    try {
        const { teamMemberId, appointmentTime, clientName, clientPhone } = req.body;
        const query = `
            INSERT INTO appointments (team_member_id, appointment_time, client_name, client_phone)
            VALUES ($1, $2, $3, $4)
        `;
        await pool.query(query, [teamMemberId, appointmentTime, clientName, clientPhone]);
        res.status(201).json({ message: 'Appointment booked successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

app.get('/test', (req, res) => {
    res.json({ message: 'Server is running' });
});