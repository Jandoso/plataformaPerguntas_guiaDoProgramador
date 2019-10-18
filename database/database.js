const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas', 'root', '01020304', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;