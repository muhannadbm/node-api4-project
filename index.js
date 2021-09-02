require('dotenv').config()
const crypto = require('crypto-js')
const express = require('express')
const cors = require('cors')
const users = require('./users/users')

const server = express()
server.use(express.json())
server.use(cors())
const PORT = process.env.PORT || 9000

server.get('/api/user', (req,res)=>{
    res.json({data: users})
})

server.post('/api/register', (req,res)=>{
    if(!req.body.username || !req.body.password){
        res.status(400).json({message: "missing name or email"})
    }
    const Encrypted_password = crypto.AES.encrypt(req.body.password, process.env.SECRET_WORD).toString()
    req.body.id = Date.now()
    req.body.password = Encrypted_password
    let new_users = [...users, req.body]
    res.status(201).json({new_users})
})

server.post('/api/login', (req,res)=>{
    if(!req.body.username || !req.body.password){
        res.status(401).json({message: "missing some credentials !"})
    }


    users.forEach(user => {
        const bytes = crypto.AES.decrypt(user.password, process.env.SECRET_WORD)
        const Decrypted_password = bytes.toString(crypto.enc.Utf8)
        if(user.username === req.body.username && Decrypted_password === req.body.password){
            res.status(200).json({message: `Welcome ${req.body.username}` })
        }
    });
    res.status(404).json({message: "user or password is not correct !"})
    
})
server.listen(PORT, ()=>{
    console.log('listening on Port ', PORT)
})