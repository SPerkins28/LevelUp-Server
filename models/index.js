const User = require('./user');
const Reviews = require('./review');
const WantToPlay = require('./wanttoplay');
const Library = require('./library');

Reviews.belongsTo(User);
WantToPlay.belongsTo(User);
Library.belongsTo(User);

User.hasMany(Reviews);
User.hasMany(WantToPlay);
User.hasMany(Library);

module.exports = {User, Reviews, WantToPlay, Library};