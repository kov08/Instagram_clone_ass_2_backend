const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
    res.send("Hello")
})

router.post("/signup", (req, res) => {
    // console.log(req.body.name)
    // res.json("Data posted successfully")
    const {name, userName, email, password}= req.body;
    // the above code means(for all): const name = req.body.name
    if (!name || !userName || !email || !password){
        res.status(422).json({error:"Please add all the fields"})
    }

    USER.findOne({$or:[{email:email},{userName:userName}]})
    .then((savedUser)=>{
        // console.log(savedUser)
        if(savedUser){
            return res.status(422).json({error:"User already exist with provided email or userName"})
        }
        bcrypt.hash(password, 12).then((hashedPassword)=>{
            const user = new USER({
                name,
                userName,
                email,
                password: hashedPassword
            })
        
            user.save()
            .then(user => { res.json({message:"Saved Successfully"})})
            .catch(err => { console.log(err)})        
        })          
    })    
})

module.exports = router