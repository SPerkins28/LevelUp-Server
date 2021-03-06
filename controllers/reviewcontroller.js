const router = require("express").Router();
const validateSession = require("../middleware/validateSession");
const Review = require("../models/review");

/* CREATE REVIEW */
router.post("/create", validateSession, async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole === "banned") {
      res.status(401).json({
        message:
          "Quest Falied: Your account does not have permission to post reviews",
      });
    } else {
      const newReview = await Review.create({
        title: req.body.review.title,
        date: req.body.review.date,
        gameId: req.body.review.gameId,
        entry: req.body.review.entry,
        rating: req.body.review.rating,
        userId: req.user.id,
      });
      res.status(201).json({
        message: "Quest Completed: Review submitted!",
        review: newReview,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Quest Failed: Review not submitted!",
      error: error,
    });
  }
}),
  /* GET ALL REVIEWS FOR GAME */
  router.get("/games/:gameId", async (req, res) => {
    const gameId = req.params.gameId;
    try {
      let reviews = await Review.findAll({
        where: { gameId: gameId },
        include: "user",
      });
      res.status(200).json({
        reviews: reviews,
        message: "You opened the chest and found some Reviews!",
      });
    } catch (error) {
      res.status(500).json({
        message: "You opened the chest and found nothing but dust...",
        error: error,
      });
    }
  }),
  /* GET ALL REVEIWS BY USER ID */
  router.get("/user/:userId", validateSession, async (req, res) => {
    const userId = req.params.userId;
    try {
      let userReviews = await Review.findAll({
        where: { userId: userId },
        include: "user",
      });
      res.status(200).json({
        userReviews: userReviews,
        message: "You found 5g and all of these reviews!",
      });
    } catch (error) {
      res.status(500).json({
        message: "You found nothing, move along...",
        error: error,
      });
    }
  }),
  /* UPDATE REVIEWS FOR GAME BY REVIEW ID */
  router.put("/game/:id", validateSession, async (req, res) => {
    try {
      const query = req.params.id;
      const review = await Review.findOne({ where: { id: query } });
      console.log(`GameId: ${review.gameId}`);
      if (req.user.role === "banned"){
        res.status(401).json({
          message:
            "Quest Falied: Your account does not have permission to update reviews",
        });
      } else {
      const reviewToUpdate = await Review.update(req.body, {
        where: { id: query },
      });
      const updatedReviews = await Review.findAll({
        where: { gameId: review.gameId },
        include: "user",
      });
      res.status(200).json({
        editedReview: reviewToUpdate,
        message: "Quest Completed: Review Updated!",
        updatedReviews: updatedReviews,
      });
    }
    } catch (error) {
      res.status(500).json({
        message: "Quest Failed: Review not updated!",
        error: error,
      });
    }
  }),
  /* UPDATE REVIEWS FOR USER BY REVIEW ID */
  router.put("/user/:id", validateSession, async (req, res) => {
    try {
      const query = req.params.id;
      const review = await Review.findOne({ where: { id: query } });
      console.log(`GameId: ${review.gameId}`);
      const reviewToUpdate = await Review.update(req.body, {
        where: { id: query },
      });
      const updatedReviews = await Review.findAll({
        where: { userId: review.userId },
        include: "user",
      });
      res.status(200).json({
        editedReview: reviewToUpdate,
        message: "Quest Completed: Review Updated!",
        updatedReviews: updatedReviews,
      });
    } catch (error) {
      res.status(500).json({
        message: "Quest Failed: Review not updated!",
        error: error,
      });
    }
  }),
  /* DELETE REVIEWS FOR GAME BY REVEIW ID */
  router.delete("/game/:id", validateSession, async (req, res) => {
    try {
      const review = await Review.findOne({ where: { id: req.params.id } });
      const query = req.params.id;

      console.log(review.userId);
      console.log(req.user.id);
      console.log(req.user.role);

      if (req.user.role === "banned") {
        res.status(401).json({
          message:
            "Quest Falied: Your account does not have permission to post reviews",
        });
      } else if (review.userId === req.user.id || req.user.role === "admin") {
        const reviewToDelete = await Review.destroy({ where: { id: query } });
        const updatedReviews = await Review.findAll({
          where: { gameId: review.gameId },
          include: "user",
        });
        res.status(200).json({
          deletedReview: reviewToDelete,
          message:
            "Review destroyed successfully! You received 5 useless parts...",
          updatedReviews: updatedReviews,
        });
      } else {
        res.status(401).json({
          error: "You are not the required level to use this action! Level Up!",
        });
      }
    } catch (error) {
      res.status(500).json({
        error: error,
        message: "Review not destroyed. Try better next time!",
      });
    }
  }),
  /* DELETE REVIEWS FOR USER BY REVEIW ID */
  router.delete("/user/:id", validateSession, async (req, res) => {
    try {
      const review = await Review.findOne({ where: { id: req.params.id } });
      const query = req.params.id;

      console.log(review.userId);
      console.log(req.user.id);
      console.log(req.user.role);

      if (review.userId === req.user.id || req.user.role === "admin") {
        const reviewToDelete = await Review.destroy({ where: { id: query } });
        const updatedReviews = await Review.findAll({
          where: { userId: review.userId },
          include: "user",
        });
        res.status(200).json({
          deletedReview: reviewToDelete,
          message:
            "Review destroyed successfully! You received 5 useless parts...",
          updatedReviews: updatedReviews,
        });
      } else {
        res.status(401).json({
          error: "You are not the required level to use this action! Level Up!",
        });
      }
    } catch (error) {
      res.status(500).json({
        error: error,
        message: "Review not destroyed. Try better next time!",
      });
    }
  }),
  (module.exports = router);
