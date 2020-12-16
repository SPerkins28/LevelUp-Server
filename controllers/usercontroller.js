const router = require("express").Router();
const {User} = require('../models');

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
                message: "Player One Ready!",
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

