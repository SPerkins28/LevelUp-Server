const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const validateSession = require('../middleware/headers');

/* CREATE REVIEW */
router.post('/create', validateSession, async (req, res) => {
    const reviewEntry = {
        title: req.body.review.title,
        date: req.body.review.date,
        id: req.body.review.id,
        entry: req.body.review.entry,
        rating: req.body.review.rating,
        username: req.user.username
    }
    Review.create(reviewEntry)
        .then(review => res.status(200).json(review))
        .catch(err => res.status(500).json({error: err}))
});

