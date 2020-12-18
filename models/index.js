const User = require('./user');
const Reviews = require('./review');
const WantToPlay = require('./wantToPlay');
const Library = require('./library');

// User.hasOne(Library);

Reviews.belongsTo(User);
WantToPlay.belongsTo(User);
// Library.belongsTo(User);

User.hasMany(Reviews);
User.hasMany(WantToPlay);

module.exports = {User, Reviews, WantToPlay, Library};