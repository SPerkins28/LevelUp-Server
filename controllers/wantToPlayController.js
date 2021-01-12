const router = require("express").Router();
const WantToPlay = require("../models/wantToPlay");
const validateSession = require("../middleware/validateSession");

/* ADD TO WANT TO PLAY LIST */
router.post("/", validateSession, async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole === "banned") {
      res.status(401).json({
        message:
          "Quest Falied: Your account does not have permission to add games to your list.",
      });
    } else {
      const newWTP = await WantToPlay.create({
        title: req.body.title,
        gameId: req.body.gameId,
        gameImg: req.body.gameImg,
        releaseDate: req.body.releaseDate,
        played: req.body.played,
        uniqueCheck: `game${req.body.gameId}user${req.user.id}`,
        userId: req.user.id,
      });
      res.status(200).json({
        message: `${newWTP.title} has been added to your list. Now go play it!`,
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
      let userWantToPlay = await WantToPlay.findAll({
        where: { userId: userId },
        include: "user",
      });
      res.status(200).json({
        userWantToPlay: userWantToPlay,
        message: "You have found your want to play list! Now play some games!",
      });
    } catch (error) {
      res.status(500).json({
        message: "You look far and wide and have found nothing...",
        error: error,
      });
    }
  }),
  /* CHANGE PLAYED STATUS */
  router.put("/:id", validateSession, async (req, res) => {
    const updateWantToPlay = {
      played: req.body.played,
    };

    try {
      const query = req.params.id;
      await WantToPlay.update(updateWantToPlay, { where: { id: query } });
      const updatedList = await WantToPlay.findAll({
        where: { userId: req.user.id },
      });
      res.status(200).json({
        updatedList: updatedList,
        message: "Status updated!",
      });
    } catch (error) {
      res.status(500).json({
        message: "Did you really play this game yet? Game not removed!",
        error: error,
      });
    }
  }),
  /* DELETE FROM LIST */
  router.delete("/delete/:id", validateSession, async (req, res) => {
    try {
      const gameAdded = await WantToPlay.findOne({
        where: { id: req.params.id },
      });
      const query = req.params.id;

      if (gameAdded.userId === req.user.id || req.user.role === "admin") {
        let updatedList = await WantToPlay.findAll({
          where: { userId: req.user.id },
        });
        await WantToPlay.destroy({ where: { id: query } });
        res.status(200).json({
          updatedList: updatedList,
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
