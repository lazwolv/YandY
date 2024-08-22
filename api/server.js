const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5500'
}));

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/yandy', { useNewUrlParser: true, useUnifiedTopology: true });

// User model
const User = mongoose.model('User', {
    fullName: String,
    email: String,
    username: String,
    password: String
});

// Hello World endpoint
app.get('/hello', (req, res) => {
    res.json({ message: 'Hello, World!' });
});

// Signup route
app.post('/signup', async (req, res) => {
    try {
        const { fullName, email, username, password } = req.body;
        const user = new User({ fullName, email, username, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});