const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5500', // frontend URL
    credentials: true
}));
app.use(session({
    secret: 'hairhustlersecret',
    resave: false,
    saveUninitialized: true
}));

// =========================
// Routes
// =========================

// --- Signup ---
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, 
        [name, email, hashedPassword],
        function(err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: 'User registered successfully', user_id: this.lastID });
        });
});

// --- Login ---
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const valid = bcrypt.compareSync(password, user.password);
        if (!valid) return res.status(400).json({ error: 'Invalid password' });

        req.session.userId = user.id;
        res.json({ message: 'Logged in successfully', user });
    });
});

// --- Logout ---
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out' });
});

// --- Get all barbers ---
app.get('/barbers', (req, res) => {
    db.all(`SELECT * FROM barbers`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// --- Get barber details ---
app.get('/barber/:id', (req, res) => {
    const barberId = req.params.id;
    db.get(`SELECT * FROM barbers WHERE id = ?`, [barberId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Barber not found' });
        res.json(row);
    });
});

// --- Book a barber ---
app.post('/book', (req, res) => {
    const { user_id, barber_id, service, date, time, location } = req.body;
    db.run(`INSERT INTO bookings (user_id, barber_id, service, date, time, location) VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, barber_id, service, date, time, location],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Booking created', booking_id: this.lastID });
        });
});

// --- Get user bookings ---
app.get('/mybookings/:user_id', (req, res) => {
    const userId = req.params.user_id;
    db.all(`SELECT b.*, br.name AS barber_name, br.phone AS barber_phone FROM bookings b
            JOIN barbers br ON b.barber_id = br.id
            WHERE b.user_id = ?`, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Hair Hustler backend running on http://localhost:${PORT}`);
});
