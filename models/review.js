const { DataTypes } = require("sequelize");
const db = require("../db");

const Review = db.define("review", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  gameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  entry: {
    type: DataTypes.STRING(2500),
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      max: 5,
    },
  },
});

module.exports = Review;
