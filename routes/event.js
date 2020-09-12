const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const reqLogin = require('../middleware/reqLogin')
const Event = mongoose.model("Event")
const Comment = mongoose.model("Comment")


router.post('/createevent', reqLogin, (req, res) => {
    const { title, body } = req.body
    if (!title || !body) {
        return res.status(422).json({ error: "Plase add all the fields" })
    }
    req.user.password = undefined
    const event = new Event({
        title,
        body,
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
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .populate("comments.responses.postedBy", "_id name")
        .then((events) => {
            res.json({ events })
        }).catch(err => {
            console.log(err)
        })

})

router.get('/myevents', reqLogin, (req, res) => {
    Event.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .populate("comments.responses.postedBy", "_id name")
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
        })
            .populate("comments.postedBy", "_id name")
            .populate("postedBy", "_id name")
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
    })
    .populate("responses.postedBy", "_id name")
    .populate("postedBy", "_id name")
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

module.exports = router