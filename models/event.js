const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const eventSchema = new mongoose.Schema({
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
        required:true
    },
    postedBy:{
       type:ObjectId,
       ref:"User"
    },
    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"User"},
        responses:[{
            text:String,
            postedBy:{type:ObjectId,ref:"User"},
        }]
    }],

},{timestamps:true})

mongoose.model("Event",eventSchema)