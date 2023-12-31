const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 5000;
const {mongoUrl} = require('./keys')

app.use(cors())
require("./models/model")
require("./models/post")


app.use(express.json())
app.use(require("./routes/auth"))
app.use(require("./routes/createPost"))
app.use(require("./routes/user"))


mongoose.connect(mongoUrl)
mongoose.connection.on("connected", ()=>{
    console.log("Successfully connected to mongoDB")
})
mongoose.connection.on("error", ()=>{
    console.log("Not connected to mongoDB")
})

app.listen(PORT, ()=>{
    console.log("Server is running on " + PORT)
})