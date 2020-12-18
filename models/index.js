const User = require('./user');
const Reviews = require('./review');
const Favorites = require('./favorites');
const Library = require('./library');

// User.hasOne(Library);

Reviews.belongsTo(User);
// Favorites.belongsTo(User);
// Library.belongsTo(User);

User.hasMany(Reviews);
// User.hasMany(Favorites);

module.exports = {User, Reviews, Favorites, Library};