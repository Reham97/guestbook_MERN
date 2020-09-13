const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const reqLogin = require('../middleware/reqLogin')
const Message = mongoose.model("Message")
const Comment = mongoose.model("Comment")


router.post('/createmessage', reqLogin, (req, res) => {
    const { title, body, photo } = req.body
    if (!title || !body || !photo) {
        return res.status(422).json({ error: "Plase add all the fields" })
    }
    req.user.password = undefined
    const message = new Message({
        title,
        body,
        photo,
        postedBy: req.user
    })
    message.save().then(result => {
        res.json({ message: result })
    })
        .catch(err => {
            console.log(err)
        })
})

router.get('/specificmessage/:messageId', reqLogin, (req, res) => {
    Message.findById(req.params.messageId).
        populate({
            path: 'comments',
            populate: { path: 'comments', model: 'Comment', select: '_id text' }
        }).populate({
            path: 'comments',
            populate: { path: 'postedBy', model: 'User', select: '_id name' },

        })
        .then((message) => {
            res.json({ message })
        })
        .catch(err => {
            console.log(err)
        })
})

router.put('/updatemessagetitle', reqLogin, (req, res) => {
    const { title,messageId } = req.body
    if (!title || !messageId) {
        return res.status(422).json({ error: "plase enter data" })
    }
    Message.findByIdAndUpdate(messageId, {
        $set: { title: title }
    }, {
        new: true
    }).populate('postedBy', '_id name')
    .populate({
        path: 'comments',
        populate: { path: 'comments', model: 'Comment', select: '_id text' }
    }).populate({
        path: 'comments',
        populate: { path: 'postedBy', model: 'User', select: '_id name' },
    })
    .then((message) => {
        res.json({ message })
    }).catch(err => {
        console.log(err)
    })
        
})

router.put('/updatemessagebody', reqLogin, (req, res) => {
    const { body,messageId } = req.body
    if (!body || !messageId) {
        return res.status(422).json({ error: "plase enter data" })
    }
    Message.findByIdAndUpdate(messageId, {
        $set: { body: body }
    }, {
        new: true
    }).populate('postedBy', '_id name')
    .populate({
        path: 'comments',
        populate: { path: 'comments', model: 'Comment', select: '_id text' }
    }).populate({
        path: 'comments',
        populate: { path: 'postedBy', model: 'User', select: '_id name' },
    })
    .then((message) => {
        res.json({ message })
    }).catch(err => {
        console.log(err)
    })
        
})

router.put('/updatemessagephoto', reqLogin, (req, res) => {
    const { photo,messageId } = req.body
    if (!photo || !messageId) {
        return res.status(422).json({ error: "plase enter data" })
    }
    Message.findByIdAndUpdate(messageId, {
        $set: { photo: photo }
    }, {
        new: true
    }).populate('postedBy', '_id name')
    .populate({
        path: 'comments',
        populate: { path: 'comments', model: 'Comment', select: '_id text' }
    }).populate({
        path: 'comments',
        populate: { path: 'postedBy', model: 'User', select: '_id name' },
    })
    .then((message) => {
        res.json({ message })
    }).catch(err => {
        console.log(err)
    })
})

router.get('/allmessages', reqLogin, (req, res) => {
    Message.find()
        .populate('postedBy', '_id name')
        .populate({
            path: 'comments',
            populate: { path: 'comments', model: 'Comment', select: '_id text' }
        }).populate({
            path: 'comments',
            populate: { path: 'postedBy', model: 'User', select: '_id name' },

        })
        .then((messages) => {
            res.json({ messages })
        }).catch(err => {
            console.log(err)
        })

})

router.get('/mymessages', reqLogin, (req, res) => {
    Message.find({ postedBy: req.user._id }).
        populate({
            path: 'comments',
            populate: { path: 'comments', model: 'Comment', select: '_id text' }
        }).populate({
            path: 'comments',
            populate: { path: 'postedBy', model: 'User', select: '_id name' },

        })
        .then((mymessages) => {
            res.json({ mymessages })
        })
        .catch(err => {
            console.log(err)
        })
})

router.put('/comment', reqLogin, (req, res) => {
    const { text, messageId } = req.body
    if (!text || !messageId) {
        return res.status(422).json({ error: "Plase add all the fields" })
    }
    const comment = new Comment({
        text,
        postedBy: req.user
    })
    comment.save().then(result => {
        Message.findByIdAndUpdate(req.body.messageId, {
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

router.delete('/deletemessage/:messageId', reqLogin, (req, res) => {
    Message.findOne({ _id: req.params.messageId })
        .populate("postedBy", "_id")
        .exec((err, message) => {
            if (err || !message) {
                return res.status(422).json({ error: err })
            }
            if (message.postedBy._id.toString() === req.user._id.toString()) {
                message.remove()
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