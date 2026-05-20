const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV == 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}
));

const users = [
    { id: 1, username: 'user1', password: 'password1' }
];

app.post('/login', (req, res) => {
    const { username, password } = req.body

    const user = users.find(user =>
        user.username == username &&
        user.password == password
    )

    if (!user) {
        return res.status(401).json({ message: "Invalid Credentials" })
    }

    req.session.user = {
        id: user.id,
        username: user.username
    }

    res.json({ message: 'Login successful', user: req.session.user });
})


// protected router
app.get('/profile', (req, res) => {
    console.log(req.session.user);

    if (!req.session.user) {
        return res.status(401).json({ message: 'unauthorized' })
    }

    res.json({ message: 'Profile accessed', user: req.session.user })
})

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' })
        }
        res.json({ message: 'Logout successful' })
    })
})

app.listen(8080, () => {
    console.log("Server running on http://localhost:8080")
})