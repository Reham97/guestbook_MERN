const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const reqLogin = require('../middleware/reqLogin')
const Event = mongoose.model("Event")
const Comment = mongoose.model("Comment")


router.post('/createevent', reqLogin, (req, res) => {
    const { title, body, photo } = req.body
    if (!title || !body || !photo) {
        return res.status(422).json({ error: "Plase add all the fields" })
    }
    req.user.password = undefined
    const event = new Event({
        title,
        body,
        photo,
        postedBy: req.user
    })
    event.save().then(result => {
        res.json({ event: result })
    })
        .catch(err => {
            console.log(err)
        })
})

router.get('/allevents', reqLogin, (req, res) => {
    Event.find()
    .populate('postedBy','_id name')
    .populate({
        path: 'comments',
        populate: { path: 'comments', model: 'Comment', select: '_id text' }
    }).populate({
        path: 'comments',
        populate: { path: 'postedBy', model: 'User', select: '_id name' },

    })
        .then((events) => {
            res.json({ events })
        }).catch(err => {
            console.log(err)
        })

})

router.get('/myevents', reqLogin, (req, res) => {
    Event.find({ postedBy: req.user._id }).
        populate({
            path: 'comments',
            populate: { path: 'comments', model: 'Comment', select: '_id text' }
        }).populate({
            path: 'comments',
            populate: { path: 'postedBy', model: 'User', select: '_id name' },

        })
        .then((myevents) => {
            res.json({ myevents })
        })
        .catch(err => {
            console.log(err)
        })
})

router.put('/comment', reqLogin, (req, res) => {
    const { text, eventId } = req.body
    if (!text || !eventId) {
        return res.status(422).json({ error: "Plase add all the fields" })
    }
    const comment = new Comment({
        text,
        postedBy: req.user
    })
    comment.save().then(result => {
        Event.findByIdAndUpdate(req.body.eventId, {
            $push: { comments: result }
        }, {
            new: true
        }).
            populate({
                path: 'comments',
                populate: { path: 'comments', model: 'Comment', select: '_id text' }
            }).populate({
                path: 'comments',
                populate: { path: 'postedBy', model: 'User', select: '_id name' },

            })
            .exec((err, result) => {
                if (err) {
                    return res.status(422).json({ error: err })
                } else {
                    res.json(result)
                }
            })
    })
        .catch(err => {
            console.log(err)
        })
})

router.put('/response', reqLogin, (req, res) => {
    const { text, commentId } = req.body
    if (!text || !commentId) {
        return res.status(422).json({ error: "Plase add all the fields" })
    }
    const response = {
        text,
        postedBy: req.user
    }

    Comment.findByIdAndUpdate(req.body.commentId, {
        $push: { responses: response }
    }, {
        new: true
    }).
        populate({
            path: 'comments',
            populate: { path: 'comments', model: 'Comment', select: '_id text' }
        }).populate({
            path: 'comments',
            populate: { path: 'postedBy', model: 'User', select: '_id name' },

        })
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})

router.delete('/deleteevent/:eventId', reqLogin, (req, res) => {
    Event.findOne({ _id: req.params.eventId })
        .populate("postedBy", "_id")
        .exec((err, event) => {
            if (err || !event) {
                return res.status(422).json({ error: err })
            }
            if (event.postedBy._id.toString() === req.user._id.toString()) {
                event.remove()
                    .then(result => {
                        res.json(result)
                    }).catch(err => {
                        console.log(err)
                    })
            }
        })
})

router.delete('/deletecomment/:commentId', reqLogin, (req, res) => {
    Comment.findOne({ _id: req.params.commentId })
        .populate("postedBy", "_id")
        .exec((err, comment) => {
            if (err || !comment) {
                return res.status(422).json({ error: err })
            }
            if (comment.postedBy._id.toString() === req.user._id.toString()) {
                comment.remove()
                    .then(result => {
                        res.json(result)
                    }).catch(err => {
                        console.log(err)
                    })
            }
        })
})

router.put('/updatecomment/:commentId', reqLogin, (req, res) => {
    Comment.findOne({ _id: req.params.commentId })
        .populate("postedBy", "_id")
        .exec((err, comment) => {
            if (err || !comment) {
                return res.status(422).json({ error: err })
            }
            if (comment.postedBy._id.toString() === req.user._id.toString()) {
                comment.text = req.body.commentText
                comment.save()
                    .then(result => {
                        res.json(result)
                    }).catch(err => {
                        console.log(err)
                    })
            }
        })
})


module.exports = router