const {Sequelize, DataTypes} = require("sequelize");
const simple_2fa_db = new Sequelize(
 'simple_2fa',
 'root',
 'mypass',
  {
    host: '0.0.0.0',
    dialect: 'mysql'
  }
);

const User = simple_2fa_db.define("user", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        unique: {
            args: true,
            msg: 'email used'
        }
    },
    phone_number: {
        type: DataTypes.STRING,
        unique: {
            args: true,
            msg: 'noHP used'
        }
    },
    password: DataTypes.STRING,
    secret_key: DataTypes.STRING,
});


User.sync(); 

module.exports = {User}; 