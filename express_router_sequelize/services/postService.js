const { models } = require("../utils/db");
const { Op } = require("sequelize");

const Post = models.Post;

async function findAllPosts() {
    const posts = await Post.findAll();
    console.log(posts);
    return posts;
}

async function findPostById(id) {
  const post = await Post.findAll({
    where: {
      id: id,
    },
  });

  console.log(post);

  return post;
}

async function findAllActivePostForUserId(userId) {
  const post = await Post.findAll({
    where: {
      userId: userId,
      isActive: {
        [Op.eq]: true
      }
    }
  })

  return post;
}

async function createPost(post) {
  post = await Post.create(post);
  console.log("Post's auto-generated ID:", post.id);
}

async function putPost(post, delta) {
  post = await Post.update(delta, {
    where: {
      id: post.id,
    },
  });
  console.log("post PUT", post);
}

async function patchPost(post, delta) {
  post = await Post.update(delta, {
    where: {
      id: post.id,
    },
  });

  console.log("post PATCH", post);
}

async function deletePostById(id) {
  await post.destroy({
    where: {
      id: id,
    },
  });
}

module.exports = {
  findAllPosts,
  findPostById,
  findAllActivePostForUserId,
  createPost,
  putPost,
  patchPost,
  deletePostById,
};
