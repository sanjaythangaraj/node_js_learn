const Joi = require('joi')

const User = require('../models/User');

const getUsers = (req, res) => {
    User.findAll()
        .then((usersArray) => res.json(usersArray))
        .catch((err) => res.status(500).send())
}

const getUserById = (req, res) => {
    User.findById(req.params.id)
        .then(userArray => {
            if (userArray.length === 0) {
                send_user_not_found_response(res, req.params.id)
                return
            }

            res.json(userArray[0])

        })
        .catch((err) => res.status(500).send())
}

const createUser = (req, res) => {
    const { error, value } = userSchema.post.validate(req.body)
    if (error) {
        send_json_body_bad_request_response(res, error)
        return
    }


    User.create(value)
        .then(() => res.status(201).send())
        .catch((err) => res.status(500).send())
}

const putUser = (req, res) => {
    const { error, value } = userSchema.put.validate(req.body)

    if (error) {
        send_json_body_bad_request_response(res, error)
        return
    }

    User.findById(value.id)
        .then(userArray => {
            if (userArray.length === 0) {
                send_user_not_found_response(res, value.id)
                return
            }

            user = userArray[0];
            User.put(user, value)
        }).then(
            () => res.status(204).send()
        ).catch((err) => res.status(500).send())
}

const patchUser = (req, res) => {
    const { error, value } = userSchema.patch.validate(req.body)

    if (error) {
        send_json_body_bad_request_response(res, error)
        return
    }

    User.findById(value.id)
        .then(userArray => {
            if (userArray.length === 0) {
                send_user_not_found_response(res, value.id)
                return
            }
            user = userArray[0];

            User.patch(user, value)
            
        }).then(
            () => res.status(204).send()
        ).catch((err) => {
            res.status(500).send()

        })

}

const deleteUser = (req, res) => {
    User.del(req.params.id)
        .then(userArray => {
            if (userArray.length === 0) {
                send_user_not_found_response(res, req.params.id)
                return
            }

            User.del(parseInt(req.params.id))
        }).then(
            () => res.status(204).send()
        ).catch((err) => res.status(500).send())
}

function send_user_not_found_response(res, id) {
    res.status(404).json({ message: `User with id ${id} not found` })
}

function send_json_body_bad_request_response(res, error) {
    res.status(400).json({ error: 'validation_error', details: error.details })
}

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

module.exports = { getUsers, getUserById, createUser, putUser, patchUser, deleteUser }
