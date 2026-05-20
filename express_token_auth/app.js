const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET

const users = [
    { id: 1, username: 'user1', password: 'password1', role: 'user' },
    { id: 2, username: 'admin1', password: 'password1', role: 'admin' }
];

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = {
        id: user.id,
        username: user.username,
        role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })

    res.json({ message: 'Login successful', token });

});

// middleware for JWT verification
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" })
    }

    const token = authHeader.split(' ')[1];

    if (!authHeader.slice(0, 7) == "Bearer" || !token) {
        return res.status(401).json({ message: "Authorization header should be of 'Bearer <token>'" })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)

        req.user = decoded

        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

// protected route
app.get('/profile', authenticateJWT, (req, res) => {
    res.json({ message: 'Profile accessed', user: req.user })
})

// role-based protected route
app.get('/admin', authenticateJWT, (req, res) => {
    if (req.user.role !== 'admin') {
        return res
            .status(403)
            .json({ message: 'Access denied: admin role required' })
    }

    res.json({ message: 'Admin panel accessed' })
})

app.listen(8080, () => {
    console.log('Listening on http://localhost:8080')
})
