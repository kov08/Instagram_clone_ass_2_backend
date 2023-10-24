const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const POST = mongoose.model("POST")
// Route
router.post("/createPost", requireLogin, (req, res) =>{
    const { title, body } = req.body;
    if(!title || !body ) {
        return res.status(422).json({error:"Please fill all the field"})
    }
    console.log(req.user)

    const post = new POST({
        title,
        body,
        postedBy: req.user
    })
    post.save().then((result)=>{
        // res.json("OK!")
        return res.json({post: result})
    }).catch(err=> console.log(err))
})

module.exports = router