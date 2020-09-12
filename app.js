 
const express = require('express')
const mongoose = require('mongoose')
const app =express()
const PORT = 5000
const {MONGOURI}=require('./keys')

require('./models/user')
require('./models/comment')
require('./models/event')

app.use(express.json())
app.use(require('./routes/auth'));
app.use(require('./routes/event'));

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on('connected',()=>{
    console.log("connected to mongo")
})

mongoose.connection.on('error',()=>{
    console.log("error to connect to mongo")
})



app.listen(PORT,()=>{
    console.log("Server is Running on ",PORT)
})