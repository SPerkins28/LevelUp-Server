const router = require('express').Router();
const WantToPlay = require('../models/wantToPlay');
const validateSession = require('../middleware/validateSession');

/* ADD TO WANT TO PLAY LIST */
router.post('/', validateSession, async (req, res) => {
    try {
        const addGame = await WantToPlay.create({
            title: req.body.title,
            gameId: req.body.id,
            gameImg: req.body.background_image,
            releaseDate: req.body.released,
            played: req.body.played,
            uniqueCheck: `game${req.body.gameId}user${req.user.id}`
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
    const userId = req.params.userId;
    try {
        let userWantToPlay = await WantToPlay.findAll({where: {userId: userId}, include: 'user'})
        res.status(200).json({
            userWantToPlay: userWantToPlay,
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
router.put(':id', validateSession, async (req, res) => {
    const updateWantToPlay = {
        played: req.body.played
    };

    try {
        const query = req.params.id;
        await WantToPlay.update(updateWantToPlay, {where: {id: query}})
        .then((updatedList) => {
            WantToPlay.findOne({where: {id: query}})
            .then((locatedUpdatedList) => {
                res.status(200).json({
                    updated: locatedUpdatedList,
                    message: "Congratulations on playing this game!",
                    updatedList: updatedList,
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
        await WantToPlay.destroy({where: query})
        .then((removedGame) => {
            WantToPlay.findOne({where: {id: query}})
            .then((locatedRemovedGame) => {
                res.status(200).json({
                    removedGame: removedGame,
                    message: "Game removed!",
                    locatedRemovedGame: locatedRemovedGame
                })
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