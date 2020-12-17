const router = require("express").Router();
const {User} = require('../models');
const validateSession = require('../middleware/validateSession')

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UniqueConstraintError} = require('sequelize/lib/errors');

/* SIGN UP */
router.post('/register', async (req, res) => {
    let {firstName, lastName, email, username, password} = req.body;

    try {
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            username,
            password: bcrypt.hashSync(password, 13),
        });
        let token = jwt.sign({id: newUser.id},process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
        res.status(201).json({
            message: "Player 1 Created!",
            user: newUser,
            sessionToken: token
        });
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email or Username already in use"
            });
        } else {
            res.status(500).json({
                error: "Failed to create new Player."
            });
        }
    }
});

/* LOGIN */
router.post('/login', async (req, res) => {
    let {username, password} = req.body;

    try {
        let loginUser = await User.findOne({
            where: {username},
        });
        if (loginUser && (await bcrypt.compare(password, loginUser.password))) {
            const token = jwt.sign(
                {id: loginUser.id, username: loginUser.username},
                process.env.JWT_SECRET,
                {expiresIn: 60 * 60 * 24}
            );
            res.status(201).json({
                message: "Ready Player One!",
                user: loginUser,
                sessionToken: token,
            });
        } else {
            res.status(401).json({
                message: "Login Failed: Player information incorrect.",
            });
        }
    } catch (error) {
        res.status(500).json({
            error: "Error loggin in!"
        });
    }
});

/* UPDATE USERNAME */
router.put('/username/:id', validateSession, async (req, res) => {
    const query = req.params.id

    User.update(req.body, {where: {id: query}})
        .then((usernameUpdated) => {
            User.findOne({where: {id: query}})
                .then((locatedUpdatedUsername) => {
                    res.status(200).json({
                        username: locatedUpdatedUsername,
                        message: "Player 1 username updated successfully!",
                        usernameChanged: usernameUpdated,
                    });
                });
        })
        .catch((err) => res.json(err));
})

/* UPDATE PASSWORD */
router.put('/password/:id', validateSession, async (req, res) => {
    const query = req.params.id

    User.update({password: bcrypt.hashSync(req.body.password, 13)}, {where: {id: query}})
        .then((passwordUpdated) => {
            User.findOne({where: {id: query}})
                .then((locatedUpdatedPassword) => {
                    res.status(200).json({
                        password: locatedUpdatedPassword,
                        message: "Player 1 password updated successfully!",
                        passwordChanged: passwordUpdated,
                    });
                });
        })
        .catch((err) => res.json(err));
})

module.exports = router;