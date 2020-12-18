const {DataTypes} = require('sequelize');
const db = require('../db');

const WantToPlay = db.define('wanttoplay', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gameId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gameImg: {
        type: DataTypes.STRING,
    },
    releaseDate: {
        type: DataTypes.STRING
    },
    played: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    uniqueCheck: {
        type: DataTypes.STRING,
        unique: true,
    }

});

module.exports = WantToPlay;