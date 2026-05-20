const express = require('express')
const Joi = require('joi')

const app = express()

app.use(express.json())

let users = [
    { id: 1, name: "John", email: "john@example.com" },
    { id: 2, name: "Dennis", email: "denis@example.com" }
]

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

function get_user(id) {
    return users.find(user => user.id === parseInt(id))
}

function send_user_not_found_response(res, id) {
    res.status(404).json({ message: `User with id ${id} not found` })
}

function send_json_body_bad_request_response(res, error) {
    res.status(400).json({ error: 'validation_error', details: error.details })
}

function new_user(user) {
    user.id = users.length + 1
    return user;
}

function put_user(user, delta) {
    user.name = delta.name
    user.email = delta.email
    return user
}

function patch_user(user, delta) {
    if (delta.name !== undefined) user.name = delta.name
    if (delta.email !== undefined) user.email = delta.email
    return user
}


app.get('/api/users', (req, res) => {
    res.json(users)
})

app.get('/api/users/:id', (req, res) => {
    user = get_user(req.params.id)
    if (!user) {
        send_user_not_found_response(res, req.params.id)
        return;
    }
    res.json(user)
})

app.post('/api/users', (req, res) => {
    const { error, value } = userSchema.post.validate(req.body)
    if (error) {
        send_json_body_bad_request_response(res, error)
        return
    }

    user = new_user(value)
    users.push(user)
    res.status(201).send()
})

app.put('/api/users', (req, res) => {
    const { error, value } = userSchema.put.validate(req.body)

    if (error) {
        send_json_body_bad_request_response(res, error)
        return
    }

    user = get_user(value.id)
    if (!user) {
        send_user_not_found_response(res, value.id)
        return;
    }

    user = put_user(user, value)
    users = users.filter(user => user.id !== value.id)
    users.push(user)
    res.status(204).send()
})

app.patch('/api/users', (req, res) => {
    const { error, value } = userSchema.patch.validate(req.body)

    if (error) {
        send_json_body_bad_request_response(res, error)
        return
    }

    user = get_user(value.id)
    if (!user) {
        send_user_not_found_response(res, value.id)
        return;
    }

    user = patch_user(user, value)
    users = users.filter(user => user.id !== value.id)
    users.push(user)
    res.status(204).send()

})

app.delete('/api/users/:id', (req, res) => {
    user = get_user(req.params.id)
    if (!user) {
        send_user_not_found_response(res, req.params.id)
        return;
    }

    users = users.filter(user => user.id !== parseInt(req.params.id))
    res.status(204).send()
})

app.listen(8080, () => {
    console.log("listening on http://localhost:8080")
})