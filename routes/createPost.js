const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const POST = mongoose.model("POST")

// Route
router.get("/allposts", requireLogin, (rew, res) => {
    POST.find()
    .populate("postedBy","_id name")
        .then(posts => res.json(posts))
        .catch(err => console.log("allposts route err: ",err))
})

// Route for create post
router.post("/createPost", requireLogin, (req, res) => {
    const { body, pic } = req.body;
    // console.log(pic)
    if(!body || !pic ) {
        return res.status(422).json({error:"Please fill all the field"})
    }
    // console.log(req.user)

    const post = new POST({
        body,
        photo:pic,
        postedBy: req.user
    })
    post.save().then((result)=>{
        // res.json("OK!")
        return res.json({post: result})
    }).catch(err=> console.log(err))
})

// Route for getting my post
router.get("/myposts",requireLogin, (req, res)=>{
    POST.find({postedBy: req.user._id})
        .populate("postedBy","_id name")
        .then(myposts => {
            res.json(myposts)
    })

})

// Route to store userid for image like
router.put("/like", requireLogin, (req, res)=>{
    POST.findByIdAndUpdate(req.body.postId, {
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})


// Route to store userid for image unlike
router.put("/unlike", requireLogin, (req, res)=>{
    POST.findByIdAndUpdate(req.body.postId, {
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})


router.put("./comment", requireLogin, (req,res)=>{
    const comment = {
        comment: req.body.text,
        postedBy: req.body._id
    }
    POST.findByIdAndUpdate(req.body.postId,{
        $push:{comments: comment }
    },{
        new: true
    }).populate
    .exec((err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
module.exports = router