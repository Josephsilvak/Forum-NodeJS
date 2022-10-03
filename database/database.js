
const Sequelize = require('sequelize')
const connection = new Sequelize('forum_project', 'root', '0157', {
    host: 'localhost',
    dialect : 'mysql'
})

module.exports = connection
