const router = require('express').Router();
const validateSession = require('../middleware/validateSession');
const Review = require('../models/review');

/* CREATE REVIEW */
router.post('/create', validateSession, async (req, res) => {
    console.log(req.body.review.title, req.body.review.date, req.body.review.gameId, req.body.review.entry, req.body.review.rating, req.user.id)
    try {
        const newReview = await Review.create({
            title: req.body.review.title,
            date: req.body.review.date,
            gameId: req.body.review.gameId,
            entry: req.body.review.entry,
            rating: req.body.review.rating,
            userId: req.user.id
        })
        res.status(201).json({
            message: "Quest Completed: Review submitted!",
            review: newReview
        });
    } catch (error) {
        res.status(500).json({
            message: "Quest Failed: Review not submitted!",
            error: error
        });
    }
}),

/* GET ALL REVIEWS FOR GAME */
router.get('/:gameId', validateSession, async (req, res) => {
    const gameId = req.params.gameId;
    console.log(gameId)
    try {
        let reviews = await Review.findAll({where: {gameId: gameId}, include: 'user'})
        res.status(200).json({
            reviews: reviews,
            message: "You opened the chest and found some Reviews!"
        });
    } catch (error) {
        res.status(500).json({
            message: "You opened the chest and found nothing but dust...",
            error: error
        });
    }
}),



module.exports = router;
