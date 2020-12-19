const AccessControl = require('accesscontrol');
const ac = new AccessControl();

const Roles = (() => {
    ac.grant('user')
        .createOwn('review')
        .readOwn('review')
        .readAny('review')
        .updateOwn('review')
        .deleteOwn('review')
        .createOwn('wanttoplay')
        .readOwn('wanttoplay')
        .readAny('wanttoplay')
        .updateOwn('wanttoplay')
        .deleteOwn('wanttoplay')
        .createOwn('library')
        .readOwn('library')
        .readAny('library')
        .updateOwn('library')
        .deleteOwn('library')

    ac.grant('admin')
        .extend('basic')
        .deleteAny('reveiws')
        .deleteAny('wanttoplay')
        .deleteAny('library')
});

module.exports = Roles;