const { Sequelize, DataTypes } = require('sequelize')
const UserModel = require('../models/user')
const bcrypt = require('bcrypt')

let sequelize

sequelize = new Sequelize('eventinz_node_db', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    dialectOptions: {
        timezone: 'Etc/GMT-2',
    },
    logging: false
})

const User = UserModel(sequelize, DataTypes)

const initDB = () => {
    return sequelize.sync({force:true}).then(_ => {
        // bcrypt.hash('AdmEvt@123', 10)
        // .then(hash => User.create({ username: 'EventinzAdmin', name: 'Degkof', email: 'degkofittiq@gmail.com',type: 1 ,password: hash }))
        // .then(user => console.log(user.toJSON()))
        // bcrypt.hash('AdmEvt@123', 10)
        User.create({
             username: 'EventinzAdmin', 
             name: 'Degkof', 
             email: 'degkofittiq@gmail.com',
             type: 4,
             password: 'AdmEvt@123' 
            }).then(user => console.log(user.toJSON()))

        console.log('La BDD a bien été initialisée !')
    })
}

module.exports = {
    initDB, User
}