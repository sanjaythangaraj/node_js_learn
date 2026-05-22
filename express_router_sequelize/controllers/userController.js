const Joi = require("joi");

const userService = require(`../services/userService`);

const findAllUsers = (req, res) => {
  userService
    .findAllUsers()
    .then((usersArray) => {
      return res.json(usersArray);
    })
    .catch((err) => {
      return res.status(500).send();
    });
};

const findUserById = (req, res) => {
  userService
    .findUserById(req.params.id)
    .then((userArray) => {
      if (userArray.length === 0) {
        send_user_not_found_response(res, req.params.id);
        return;
      }

      res.json(userArray[0]);
    })
    .catch((err) => {
      return res.status(500).send();
    });
};

const findAllMaleAndFemaleYoungAdultUsers = (req, res) => {
  userService.findAllMaleAndFemaleYoungAdultUsers(req.params.id)
   .then((usersArray) => {
      return res.json(usersArray);
    })
    .catch((err) => {
      return res.status(500).send();
    });
}

const findUserByIdWithPosts = (req, res) => {
  userService
    .findUserByIdWithPosts(req.params.id)
    .then((userArray) => {
      if (userArray.length === 0) {
        send_user_not_found_response(res, req.params.id);
        return;
      }

      res.json(userArray[0]);
    })
    .catch((err) => {
      return res.status(500).send();
    });
};

const createUser = (req, res) => {
  const { error, value } = userSchema.post.validate(req.body);
  if (error) {
    send_json_body_bad_request_response(res, error);
    return;
  }

  userService
    .createUser(value)
    .then(() => res.status(201).send())
    .catch((err) => res.status(500).send());
};

const putUser = (req, res) => {
  const { error, value } = userSchema.put.validate(req.body);

  if (error) {
    send_json_body_bad_request_response(res, error);
    return;
  }

  userService
    .findUserById(value.id)
    .then((userArray) => {
      if (userArray.length === 0) {
        send_user_not_found_response(res, value.id);
        return;
      }

      user = userArray[0];
      userService.putUser(user, value);
    })
    .then(() => res.status(204).send())
    .catch((err) => res.status(500).send());
};

const patchUser = (req, res) => {
  const { error, value } = userSchema.patch.validate(req.body);

  if (error) {
    send_json_body_bad_request_response(res, error);
    return;
  }

  userService
    .findUserById(value.id)
    .then((userArray) => {
      if (userArray.length === 0) {
        send_user_not_found_response(res, value.id);
        return;
      }
      user = userArray[0];

      userService.patchUser(user, value);
    })
    .then(() => res.status(204).send())
    .catch((err) => res.status(500).send());
};

const deleteUserById = (req, res) => {
  userService
    .findUserById(req.params.id)
    .then((userArray) => {
      if (userArray.length === 0) {
        send_user_not_found_response(res, req.params.id);
        return;
      }

      userService.deleteUserById(parseInt(req.params.id));
    })
    .then(() => res.status(204).send())
    .catch((err) => res.status(500).send());
};

function send_user_not_found_response(res, id) {
  res.status(404).json({ message: `User with id ${id} not found` });
}

function send_json_body_bad_request_response(res, error) {
  res.status(400).json({ error: "validation_error", details: error.details });
}

const ALLOWED_GENDERS = ["Male", "Female", "Other"];

const baseSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().email(),
  gender: Joi.string().valid(...ALLOWED_GENDERS),
  age: Joi.number().positive(),
});

const userSchema = {
  post: baseSchema
    .fork(['name', 'email', 'gender', 'age'], (schema) => schema.required()),

  put: baseSchema
    .fork(['name', 'email', 'gender', 'age'], (schema) => schema.required())
    .keys({
      id: Joi.number().positive().required(),
    }),

  patch: baseSchema
    .keys({
      id: Joi.number().positive().required(),
    })
    .or('name', 'email', 'gender', 'age')
};

module.exports = {
  findAllUsers,
  findUserById,
  findAllMaleAndFemaleYoungAdultUsers,
  findUserByIdWithPosts,
  createUser,
  putUser,
  patchUser,
  deleteUserById,
};
