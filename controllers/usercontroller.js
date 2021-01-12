const router = require("express").Router();
const { User } = require("../models");
const validateSession = require("../middleware/validateSession");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const { findAll } = require("../models/user");

/* SIGN UP */
router.post("/register", async (req, res) => {
  let { firstName, lastName, email, username, password, role } = req.body;

  try {
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      username,
      password: bcrypt.hashSync(password, 13),
      role,
    });
    let token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24,
    });
    res.status(201).json({
      message: "Ready Player One!",
      user: newUser,
      userId: newUser.id,
      role: newUser.role,
      sessionToken: token,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "Email or Username already in use",
      });
    } else {
      res.status(500).json({
        error: "Failed to create new Player.",
      });
    }
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  let { username, password } = req.body;

  try {
    let loginUser = await User.findOne({
      where: { username },
    });
    if (
      loginUser &&
      (await bcrypt.compare(password, loginUser.password)) &&
      loginUser.role === "banned"
    ) {
      const token = jwt.sign(
        { id: loginUser.id, username: loginUser.username },
        process.env.JWT_SECRET,
        { expiresIn: 60 * 60 * 24 }
      );
      res.status(200).json({
        message:
          "Your account has been banned: You will no longer be allowed to create or update content.",
        user: loginUser,
        userId: loginUser.id,
        role: loginUser.role,
        sessionToken: token,
      });
    } else if (
      loginUser &&
      (await bcrypt.compare(password, loginUser.password))
    ) {
      const token = jwt.sign(
        { id: loginUser.id, username: loginUser.username },
        process.env.JWT_SECRET,
        { expiresIn: 60 * 60 * 24 }
      );
      res.status(201).json({
        message: "Ready Player One!",
        user: loginUser,
        userId: loginUser.id,
        role: loginUser.role,
        sessionToken: token,
      });
    } else {
      res.status(401).json({
        message: "Login Failed: Player information incorrect.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Error loggin in: Player not ready!",
    });
  }
});

/* GET ALL USERS */
router.get("/userlist/", validateSession, async (req, res) => {
  try {
    const allUsers = await User.findAll({
      include: ["reviews", "wantToPlays", "libraries"],
    });
    res.status(200).json({
      userList: allUsers,
      message: "You opened the chest and found all these users!",
    });
  } catch (error) {
    res.status(500).json({
      message: "You opened the chest and found absolutely nothing....",
      error: error,
    });
  }
});

/* UPDATE USER ROLE */
router.put("/role/:id", validateSession, async (req, res) => {
  const query = req.params.id;

  try {
    await User.update(req.body, { where: { id: query } });
    const updatedUser = await User.findOne({ where: { id: query } });
    res.status(200).json({
      updatedUserRole: updatedUser,
      message: "Player role updated successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "Player role updated failed!",
    });
  }
});

/* UPDATE USERNAME */
router.put("/username/:id", validateSession, async (req, res) => {
  const query = req.params.id;

  try {
    await User.update(req.body, { where: { id: query } });
    const updatedUsername = await User.findOne({ where: { id: query } });
    res.status(200).json({
      updatedUsername: updatedUsername,
      message: "Player username updated successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "You failed! Try again!",
    });
  }
});

/* UPDATE PASSWORD */
router.put("/password/:id", validateSession, async (req, res) => {
  const query = req.params.id;
  try {
    await User.update(
      { password: bcrypt.hashSync(req.body.password, 13) },
      { where: { id: query } }
    );
    const updatedPassword = await User.findOne({ where: { id: query } });
    res.status(200).json({
      updatedPassword: updatedPassword,
      message: "Player password updated successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "You failed! Try again!",
    });
  }
});

module.exports = router;
