const express = require('express');
const bcrypt = require('bcrypt');
const { Buffer } = require('node:buffer');
const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.json());

const users = [];

const basicAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        // If no credentials provided, request authentication
        res.setHeader('WWW-Authenticate', 'Basic realm="API Authentication"');
        return res.status(401).json({ message: 'Authentication required' });
    }

    const encodedCredentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8')
    const [username, password] = decodedCredentials.split(':');

    console.log("username and password", username, ":", password)

    // validate user credentials
    const user = users.find(u => u.username === username);

    console.log(users)

    console.log(user)


    if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
        res.setHeader('WWW-Authenticate', 'Basic realm="API Authentication"');
        return res.status(401).json({ message: "Invalid Credentials" })
    }


    req.user = { username: user.username }

    next();
}

app.post("/register", async (req, res) => {
    console.log(req.body);

    const { username, password } = req.body;

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: "username already taken" })
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        // const hashedPassword = password

        users.push({ username: username, hashedPassword: hashedPassword })

        res.status(201).json({ message: "user registered successfully", username: username })

    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
})


app.get("/api/data", basicAuth, (req, res) => {
    res.json({
        message: "Data accessed",
        user: req.user.username,
        data: "Example Data"
    })
})

app.listen(8080, () => {
    console.log("Listening on http://localhost:8080")
})