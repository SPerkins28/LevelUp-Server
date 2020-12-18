const AccessControl = require('accesscontrol');
const ac = new AccessControl();

const Roles = (() => {
    ac.grant('user')
        .createOwn('reviews')
        .readOwn('reviews')
        .readAny('reviews')
        .updateOwn('reviews')
        .deleteOwn('reviews')
        .createOwn('wanttoplays')
        .readOwn('wanttoplays')
        .readAny('wanttoplays')
        .updateOwn('wanttoplays')
        .deleteOwn('wanttoplays')
        .createOwn('libraries')
        .readOwn('libraries')
        .readAny('libraries')
        .updateOwn('libraries')
        .deleteOwn('libraries')

    ac.grant('admin')
        .extend('basic')
        .deleteOwn('reveiws')
        .deleteOwn('wanttoplays')
        .deleteOwn('libraries')
});

module.exports = Roles;