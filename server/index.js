const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

cors({origin:process.env.CLIENT_SERVER})

const http = require("http");

require("dotenv").config();

const app = express();

const server = http.createServer(app);

const io = require("socket.io")(server);

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser:true});
mongoose.connection.once("open", () => {
    console.log("MongoDB connection established")
})

io.on("connection", (socket) => {
    socket.on("connect", () => {
        console.log("Client browser has joined the connection");
    })
})



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on por ${PORT}`));