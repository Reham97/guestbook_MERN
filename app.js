 
const express = require('express')
const mongoose = require('mongoose')
const app =express()
const PORT = 5000
const {MONGOURI}=require('./keys')

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


app.get('/',(req,res)=>{
    res.send("hello")
})

app.listen(PORT,()=>{
    console.log("Server is Running on ",PORT)
})