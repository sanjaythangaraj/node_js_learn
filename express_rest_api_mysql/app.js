const express = require('express')
const Joi = require('joi')
const mysql = require('mysql2');

const app = express()

app.use(express.json())

let con = mysql.createConnection({
    host: "localhost",
    user: "myuser",
    password: "mypassword",
    database: "mysqldb"
});

con.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});

let sql = "CREATE TABLE IF NOT EXISTS users (id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255), email VARCHAR(255))";
con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
});


const userSchema = {
    post: Joi.object({
        name: Joi.string().min(2).max(64).required(),
        email: Joi.string().email().required()
    }),

    put: Joi.object({
        id: Joi.number().positive().required(),
        name: Joi.string().min(2).max(64).required(),
        email: Joi.string().email().required()
    }),

    patch: Joi.object({
        id: Joi.number().positive().required(),
        name: Joi.string().min(2).max(64),
        email: Joi.string().email()
    }).or('name', 'email')

}

function get_all_users() {
    return new Promise((resolve, reject) => {

        const sql = `SELECT * FROM users`

        con.query(sql, function (err, result) {
            if (err) {
                console.error(err);
                reject(err)
            }
            resolve(result);
        });
    })
}

function get_user(id) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM users WHERE id = ?`

        con.query(sql, [id], function (err, result) {
            if (err) {
                console.error(err);
                reject(err)
            }
            resolve(result)
        });

    })
}

function send_user_not_found_response(res, id) {
    res.status(404).json({ message: `User with id ${id} not found` })
}

function send_json_body_bad_request_response(res, error) {
    res.status(400).json({ error: 'validation_error', details: error.details })
}

function create_user(user) {

    return new Promise((resolve, reject) => {

        let sql = `INSERT INTO users (\`name\`, \`email\`) VALUES (?, ?)`

        con.query(sql, [user.name, user.email], function (err, result) {
            if (err) {
                console.error(err);
                reject(err)
            }
            resolve()
        });

    })
}

function put_user(user, delta) {

    return new Promise((resolve, reject) => {

        let sql = `UPDATE users SET \`name\` = ?, \`email\` = ? WHERE id = ?`

        con.query(sql, [delta.name, delta.email, user.id], function (err, result) {
            if (err) {
                console.error(err);
                reject(err)
            }
            resolve()
        });

    })
}

function patch_user(user, delta) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(delta)) {
        fields.push(`\`${key}\` = ?`);
        values.push(value);
    }

    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    values.push(user.id)

    return new Promise((resolve, reject) => {
        con.query(sql, values, function (err, result) {
            if (err) {
                console.error(err);
                reject(err)
            }
            resolve()
        })
    })
}

function delete_user(id) {
    const sql = `DELETE FROM users WHERE id = ?`
    return new Promise((resolve, reject) => {
        con.query(sql, [id], function (err, result) {
            if (err) {
                console.error(err);
                reject(err)
            }
            resolve()
        })
    })
}


app.get('/api/users', (req, res) => {
    get_all_users()
        .then((users) => res.json(users))
        .catch((err) => res.status(500).send())
})

app.get('/api/users/:id', (req, res) => {
    get_user(req.params.id)
        .then(userArray => {
            if (userArray.length === 0) {
                send_user_not_found_response(res, req.params.id)
                return
            }

            res.json(userArray[0])

        })
        .catch((err) => res.status(500).send())
})

app.post('/api/users', (req, res) => {
    const { error, value } = userSchema.post.validate(req.body)
    if (error) {
        send_json_body_bad_request_response(res, error)
        return
    }

    create_user(value)
        .then(() => res.status(201).send())
        .catch((err) => res.status(500).send())

})

app.put('/api/users', (req, res) => {
    const { error, value } = userSchema.put.validate(req.body)

    if (error) {
        send_json_body_bad_request_response(res, error)
        return
    }

    get_user(value.id)
        .then(userArray => {
            if (userArray.length === 0) {
                send_user_not_found_response(res, value.id)
                return
            }

            user = userArray[0];
            return put_user(user, value)
        }).then(
            () => res.status(204).send()
        ).catch((err) => res.status(500).send())

})

app.patch('/api/users', (req, res) => {
    const { error, value } = userSchema.patch.validate(req.body)

    if (error) {
        send_json_body_bad_request_response(res, error)
        return
    }

    get_user(value.id)
        .then(userArray => {
            if (userArray.length === 0) {
                send_user_not_found_response(res, value.id)
                return
            }

            user = userArray[0];
            return patch_user(user, value)
        }).then(
            () => res.status(204).send()
        ).catch((err) => res.status(500).send())

})

app.delete('/api/users/:id', (req, res) => {
    get_user(req.params.id)
        .then(userArray => {
            if (userArray.length === 0) {
                send_user_not_found_response(res, req.params.id)
                return
            }

            return delete_user(parseInt(req.params.id))
        }).then(
            () => res.status(204).send()
        ).catch((err) => res.status(500).send())
})

app.listen(8080, () => {
    console.log("listening on http://localhost:8080")
})