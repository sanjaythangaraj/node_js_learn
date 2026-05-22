const { models } = require("../utils/db");
const { Op } = require("sequelize");

const User = models.User;
const Post = models.Post;

async function findAllUsers() {
  const users = await User.findAll();
  console.log(users);
  return users;
}

async function findUserById(id) {
  const user = await User.findAll({
    where: {
      id: id,
    },
  });

  console.log(user);

  return user;
}

async function findAllMaleAndFemaleYoungAdultUsers(gender) {
  const users = await User.findAll({
    where: {
      gender: {
        [Op.or]: [
          {[Op.eq]: 'Male'},
          {[Op.eq]: 'Female'}
        ]
      },
      age: {
        [Op.and]: [
          {[Op.gte]: 18},
          {[Op.lte]: 38}
        ]
      }
    },
  });

  console.log(users)

  return users;
}

async function findUserByIdWithPosts(id) {
  try {
    const userWithPosts = await User.findAll({
    where: {
      id: id,
    },
    include: {
        model: Post,
        as: "posts",
      },
  });
  console.log(userWithPosts);
  return userWithPosts;
  } catch (err) {
    console.log(err);
  }
}

async function createUser(user) {
  user = await User.create(user);
  console.log("User's auto-generated ID:", user.id);
}

async function putUser(user, delta) {
  user = await User.update(delta, {
    where: {
      id: user.id,
    },
  });
  console.log("USER PUT", user);
}

async function patchUser(user, delta) {
  user = await User.update(delta, {
    where: {
      id: user.id,
    },
  });

  console.log("USER PATCH", user);
}

async function deleteUserById(id) {
  await User.destroy({
    where: {
      id: id,
    },
  });
}

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
