const sequelize = require('../utils/db');
const { DataTypes } = require('sequelize');

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: 'users',
        createdAt: false,
        updatedAt: false,
    },
)

async function findAll() {

    const users = await User.findAll();

    console.log(users);

    return users;
}

async function findById(id) {
    const user = await User.findAll({
        where: {
            id: id,
        },
    })

    console.log(user)

    return user;
}

async function create(user) {
    user = await User.create(user);
    console.log("User's auto-generated ID:", user.id);
}

async function put(user, delta) {
    user = await User.update(
        delta,
        {
            where: {
                id: user.id
            }
        }
    );
    console.log("USER PUT", user);
}

async function patch(user, delta) {
    
    user = await User.update(
        delta,
        {
            where: {
                id: user.id
            }
        }
    )

    console.log("USER PATCH", user)

}

async function del(id) {
    await User.destroy(
        {
            where: {
                id: id
            }
        }
    )
}

module.exports = { findAll, findById, create, put, patch, del }