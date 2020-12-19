const router = require('express').Router();
const Library = require('../models/library');
const validateSession = require('../middleware/validateSession');

/* ADD TO LIBRARY */
router.post('/', validateSession, async (req, res) => {
    try {
        await Library.create({
            title: req.body.title,
            gameId: req.body.gameId,
            gameImg: req.body.gameImg,
            releaseDate: req.body.releaseDate,
            finished: req.body.finished,
            uniqueCheck: `game${req.body.gameId}user${req.user.id}`,
            userId: req.user.id
        })
        .then(game => res.status(200).json({
            message: `${game.title} has been added to your Library!`,
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
            message: "You have found your Library! Now play some games!"
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
        finished: req.body.finished
    };

    try {
        const query = req.params.id;
        await Library.update(updateLibrary, {where: {id: query}})
        .then((updatedLibrary) => {
            Library.findOne({where: {id: query}})
            .then((locatedUpdatedLibrary) => {
                res.status(200).json({
                    updated: locatedUpdatedLibrary,
                    message: "What are you going to play now?",
                    updatedList: updatedLibrary,
                })
            })
        });
    } catch (error) {
        res.status(500).json({
            message: "Did you really finish this game yet?",
            error: error
        });
    }
}),

/* DELETE FROM LIST */
router.delete('/delete/:id', validateSession, async (req, res) => {
    try {
        const gameAdded = await Library.findOne({where: {id: req.params.id}})
        const query = req.params.id;

        console.log(gameAdded.userId);
        console.log(req.user.id);
        console.log(req.user.role);

        if (gameAdded.userId === req.user.id || req.user.role === 'admin'){
            let locatedRemovedGame = await Library.findOne({where: {id: query}})
            Library.destroy({where: {id: query}})
            .then((removedGame) => {
                    res.status(200).json({
                        removedGame: removedGame,
                        message: "Game removed!",
                        locatedRemovedGame: locatedRemovedGame
                    })
        })} else {
            res.status(401).json({
                error: 'You are not the required level to use this action!'
            })
        }
    } catch (error) {
        res.status(500).json({
            error: error,
            message: "Game not removed. Try better next time!"
        }) 
    }
    
})

module.exports = router;