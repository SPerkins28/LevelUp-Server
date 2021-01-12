const { DataTypes } = require("sequelize");
const db = require("../db");

const WantToPlay = db.define("wantToPlay", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gameImg: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  releaseDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  played: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  uniqueCheck: {
    type: DataTypes.STRING,
    unique: true,
  },
});

module.exports = WantToPlay;
