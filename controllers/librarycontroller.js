const router = require('express').Router();
const Library = require('../models/library');
const validateSession = require('../middleware/validateSession');

/* ADD TO LIBRARY */
router.post('/', validateSession, async (req, res) => {
    try {
        const addGame = await Library.create({
            title: req.body.title,
            gameId: req.body.gameId,
            gameImg: req.body.gameImg,
            releaseDate: req.body.releaseDate,
            finished: req.body.finished,
            uniqueCheck: `game${req.body.gameId}user${req.user.id}`,
            userId: req.user.id
        })
        .then(game => res.status(200).json({
            message: `${game.title} has been added to your list. Now go play it!`
        }))
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}),

/* GET WANT TO PLAY BY USER ID */
router.get('/:id', validateSession, async (req, res) => {
    const userId = req.params.id;
    try {
        let userLibrary = await Library.findAll({where: {userId: userId}, include: 'user'})
        res.status(200).json({
            userLibrary: userLibrary,
            message: "You have found your want to play list! Now play some games!"
        })
    } catch (error) {
        res.status(500).json({
            message: "You look far and wide and have found nothing...",
            error: error
        })
    }
}),

/* CHANGE PLAYED STATUS */
router.put('/:id', validateSession, async (req, res) => {
    const updateLibrary = {
        played: req.body.played
    };

    try {
        const query = req.params.id;
        await Library.update(updateLibrary, {where: {id: query}})
        .then((updatedLibrary) => {
            Library.findOne({where: {id: query}})
            .then((locatedUpdatedLibrary) => {
                res.status(200).json({
                    updated: locatedUpdatedLibrary,
                    message: "Congratulations on playing this game!",
                    updatedList: updatedLibrary,
                })
            })
        });
    } catch (error) {
        res.status(500).json({
            message: "Did you really play this game yet? Game not removed!",
            error: error
        });
    }
}),

/* DELETE FROM LIST */
router.delete('/delete/:id', validateSession, async (req, res) => {
    try {
        const query = req.params.id;
        const locatedRemovedGame = await Library.findOne({where: {id: query}})
        Library.destroy({where: {id: query}})
        .then((removedGame) => {
                res.status(200).json({
                    removedGame: removedGame,
                    message: "Game removed!",
                    locatedRemovedGame: locatedRemovedGame
                })
        })
    } catch (error) {
        res.status(500).json({
            error: error,
            message: "Game not removed. Try better next time!"
        }) 
    }
    
})

module.exports = router;