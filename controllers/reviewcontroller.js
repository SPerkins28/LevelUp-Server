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
router.get('/games/:gameId', validateSession, async (req, res) => {
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

/* GET ALL REVEIWS BY USER ID */
router.get('/user/:userId', validateSession, async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);
    try {
        let userReviews = await Review.findAll({where: {userId: userId}, include: 'user'})
        res.status(200).json({
            userReviews: userReviews,
            message: "You found 5g and all of these reviews!"
        });
    } catch (error) {
        res.status(500).json({
            message: "You found nothing, move along...",
            error: error
        });
    }
}),

/* UPDATE REVIEWS BY REVIEW ID */
router.put('/:id', validateSession, async (req, res) => {
    try {
        const query = req.params.id;
        await Review.update(req.body, {where: {id: query}})
        .then((updatedReview) => {
            Review.findOne({ where: {id: query} })
            .then((locatedUpdatedReview) => {
                res.status(200).json({
                    editedReview: locatedUpdatedReview,
                    message: "Quest Completed: Review Updated!",
                    updatedReview: updatedReview,
                })
            })
        });
    } catch (error) {
        res.status(500).json({
            message: "Quest Failed: Review not updated!",
            error: error
        });
    }
}),

/* DELETE REVIEWS BY REVEIW ID */
router.delete('/:id', validateSession, async (req, res) => {
    try {
        const query = req.params.id;
        await Review.destroy({where: {id: query}})
        .then((deletedReview) => {
            Review.findOne({where: {id: query} })
            .then((locatedDeletedReview) => {
                res.status(200).json({
                    deletedReview: deletedReview,
                    message: "Review destroyed successfully! You received 5 useless parts...",
                    locatedDelete: locatedDeletedReview
                })
            })
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            message: "Review not destroyed. Try better next time!"
        })        
    }
}),



module.exports = router;
