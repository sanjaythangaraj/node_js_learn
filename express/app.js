const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('GET request to the homepage')
})

// Route with Parameters
app.get('/api/users/:userid/books/:bookid', (req, res) => {
    res.send(`User Id: ${req.params.userid}, Book Id: ${req.params.bookid}`)
})

// route with query params
app.get('/search', (req, res) => {
    const { q, category } = req.query;
    res.send(`Query Params  q: ${q}, Book Id: ${category}`)
})

app.post('/', (req, res) => {
    res.send('POST request to the homepage');
});

app.use((req, res) => {
    res.status(404).send('404 - Page not found');
})

app.listen(8080, () => {
    console.log(`Server listening at http://localhost:8080`)
})

// query params
// http GET localhost:8080/search q==apo category==fruits

// url params
// http GET localhost:8080/api/users/user1/books/book12