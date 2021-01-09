const router = require("express").Router();
const Library = require("../models/library");
const validateSession = require("../middleware/validateSession");

/* ADD TO LIBRARY */
router.post("/", validateSession, async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole === "banned") {
      res.status(401).json({
        message:
          "Quest Falied: Your account does not have permission to add games to your library.",
      });
    } else {const newLibrary = await Library.create({
      title: req.body.title,
      gameId: req.body.gameId,
      gameImg: req.body.gameImg,
      releaseDate: req.body.releaseDate,
      finished: req.body.finished,
      uniqueCheck: `game${req.body.gameId}user${req.user.id}`,
      userId: req.user.id,
    });
    res.status(200).json({
      message: `${newLibrary.title} has been added to your Library!`,
    });
  }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
}),
  /* GET WANT TO PLAY BY USER ID */
  router.get("/:id", validateSession, async (req, res) => {
    const userId = req.params.id;
    try {
      let userLibrary = await Library.findAll({
        where: { userId: userId },
        include: "user",
      });
      res.status(200).json({
        userLibrary: userLibrary,
        message: "You have found your Library! Now play some games!",
      });
    } catch (error) {
      res.status(500).json({
        message: "You look far and wide and have found nothing...",
        error: error,
      });
    }
  }),
  /* CHANGE FINISHED STATUS */
  router.put("/:id", validateSession, async (req, res) => {
    const updateLibrary = {
      finished: req.body.finished,
    };

    try {
      const query = req.params.id;
      await Library.update(updateLibrary, { where: { id: query } });
      const updatedList = await Library.findAll({
        where: { userId: req.user.id },
      });
      res.status(200).json({
        updatedList: updatedList,
        message: "What are you going to play now?",
      });
    } catch (error) {
      res.status(500).json({
        message: "Did you really finish this game yet?",
        error: error,
      });
    }
  }),
  /* DELETE FROM LIST */
  router.delete("/delete/:id", validateSession, async (req, res) => {
    try {
      const gameAdded = await Library.findOne({ where: { id: req.params.id } });
      const query = req.params.id;

      console.log(gameAdded.userId);
      console.log(req.user.id);
      console.log(req.user.role);

      if (gameAdded.userId === req.user.id || req.user.role === "admin") {
        let updatedList = await Library.findAll({
          where: { userId: req.user.id },
        });
        await Library.destroy({ where: { id: query } });
        res.status(200).json({
          removedGame: updatedList,
          message: "Game removed!",
        });
      } else {
        res.status(401).json({
          error: "You are not the required level to use this action! Level Up!",
        });
      }
    } catch (error) {
      res.status(500).json({
        error: error,
        message: "Game not removed. Try better next time!",
      });
    }
  });

module.exports = router;
