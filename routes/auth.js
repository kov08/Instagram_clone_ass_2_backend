const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");
const jwt =require("jsonwebtoken")
const {Jwt_secret} = require("../keys")
const requireLogin = require("../middleware/requireLogin")

router.get("/", (req, res) => {
    res.send("Hello")
})



// router.get("/createPost", requireLogin ,(req, res) => {
//     console.log("helo Auth")
// })

router.post("/signup", (req, res) => {
    // console.log(req.body.name)
    // res.json("Data posted successfully")
    const {name, userName, email, password}= req.body;
    // the above code means: const name = req.body.name  (for all as well)
    if (!name || !userName || !email || !password){
        return res.status(422).json({error:"Please add all the fields"})
    }
    USER.findOne({$or:[{email:email},{userName:userName}]})
    .then((savedUser)=>{
        // console.log(savedUser)
        if(savedUser){
            return res.status(422).json({error:"User already exist with provided email or userName"})
        }
        bcrypt.hash(password, 12).then((hashedPassword)=>{
            const user = new USER({
                name, userName, email, password: hashedPassword
            })        
            user.save()
            .then(user => { res.json({message:"Registered successfully, Let's login!"})})
            .catch(err => { console.log(err)})        
        })          
    })    
})

router.post("/signin", (req,res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(422).json({error:"Please add email and password"})
    }
    USER.findOne({email:email}).then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email"})
        }
        // console.log(savedUser);
        bcrypt.compare(password, savedUser.password)
        .then((match)=> {
            if(match){
                // return res.status(200).json({message: "Signed in Successfully "})                
                const token = jwt.sign({_id: savedUser.id}, Jwt_secret)
                res.json(token)
                console.log("jwt_token: ",token)
            }else{
                return res.status(422).json({error:"Invalid Password"}) 
            }
        })
        .catch(err => console.log(err))
    })
})

module.exports = router