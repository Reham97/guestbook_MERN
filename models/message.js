const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const messageSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
    },
    postedBy:{
        type:ObjectId,
        ref:"User"
     },
     comments:[{
        type:ObjectId,
        ref:"Comment"
     }],

},{timestamps:true})

mongoose.model("Message",messageSchema) 