const Joi = require("joi");

const postService = require(`../services/postService`);

const findAllPosts = (req, res) => {
  postService
    .findAllPosts()
    .then((postsArray) => {
      return res.json(postsArray);
    })
    .catch((err) => {
      return res.status(500).send();
    });
};

const findPostById = (req, res) => {
  postService
    .findPostById(req.params.id)
    .then((postArray) => {
      if (postArray.length === 0) {
        send_post_not_found_response(res, req.params.id);
        return;
      }

      res.json(postArray[0]);
    })
    .catch((err) => {
      return res.status(500).send();
    });
};

const findAllActivePostForUserId = (req, res) => {
     postService
    .findAllActivePostForUserId(req.query.userId)
    .then((postsArray) => {
      return res.json(postsArray);
    })
    .catch((err) => {
      return res.status(500).send();
    });
}

const createPost = (req, res) => {
  const { error, value } = postSchema.post.validate(req.body);
  if (error) {
    send_json_body_bad_request_response(res, error);
    return;
  }

  postService
    .createPost(value)
    .then(() => res.status(201).send())
    .catch((err) => res.status(500).send());
};

const putPost = (req, res) => {
  const { error, value } = postSchema.put.validate(req.body);

  if (error) {
    send_json_body_bad_request_response(res, error);
    return;
  }

  postService
    .findPostById(value.id)
    .then((postArray) => {
      if (postArray.length === 0) {
        send_post_not_found_response(res, value.id);
        return;
      }

      post = postArray[0];
      postService.putPost(post, value);
    })
    .then(() => res.status(204).send())
    .catch((err) => res.status(500).send());
};

const patchPost = (req, res) => {
  const { error, value } = postSchema.patch.validate(req.body);

  if (error) {
    send_json_body_bad_request_response(res, error);
    return;
  }

  postService
    .findPostById(value.id)
    .then((postArray) => {
      if (postArray.length === 0) {
        send_user_not_found_response(res, value.id);
        return;
      }
      post = postArray[0];

      postService.patchPost(post, value);
    })
    .then(() => res.status(204).send())
    .catch((err) => res.status(500).send());
};

const deletePostById = (req, res) => {
  postService
    .findPostById(req.params.id)
    .then((postArray) => {
      if (postArray.length === 0) {
        send_user_not_found_response(res, req.params.id);
        return;
      }

      postService.deletePostById(parseInt(req.params.id));
    })
    .then(() => res.status(204).send())
    .catch((err) => res.status(500).send());
};

function send_post_not_found_response(res, id) {
  res.status(404).json({ message: `Post with id ${id} not found` });
}

function send_json_body_bad_request_response(res, error) {
  res.status(400).json({ error: "validation_error", details: error.details });
}

const baseSchema = Joi.object({
  title: Joi.string().min(2),
  isActive: Joi.boolean(),
  content: Joi.string(),
  userId: Joi.number().positive(),
});

const postSchema = {
  post: baseSchema.fork(["title", "isActive", "content", "userId"], (schema) =>
    schema.required(),
  ),

  put: baseSchema
    .fork(["title", "isActive", "content", "userId"], (schema) =>
      schema.required(),
    )
    .keys({
      id: Joi.number().positive().required(),
    }),

  patch: baseSchema
    .keys({
      id: Joi.number().positive().required(),
    })
    .or("title", "isActive", "content", "userId"),
};

module.exports = {
  findAllPosts,
  findPostById,
  findAllActivePostForUserId,
  createPost,
  putPost,
  patchPost,
  deletePostById,
};
