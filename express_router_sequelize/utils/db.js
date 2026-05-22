const { Sequelize } = require('sequelize');
const { assoc } = require('../models/associations');

const sequelize = new Sequelize('mysqldb', 'myuser', 'mypassword', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

const modelDefiners = [
    require('../models/User'),
    require('../models/Post')
]

for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

assoc(sequelize)

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

}

testConnection();

module.exports = sequelize;