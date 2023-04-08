const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");
const { storeMessage, getMessages } = require("./middleware/roomHelpers");

const http = require("http");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors({origin:process.env.CLIENT_SERVER}));

const server = http.createServer(app);

const io = require("socket.io")(server, {cors:{origin:process.env.CLIENT_SERVER}});

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser:true});
mongoose.connection.once("open", () => {
    console.log("MongoDB connection established")
})

io.on("connection", (socket) => {
    socket.on("join", async (data, cb) => {
        console.log("Client browser has joined the connection and joined", data.room);
        socket.join(data.room);
        const res = await getMessages(data.room);
        if(res.error){
            return cb(true, {error:res.response});
        }
        cb(null, res.response);
    })

    socket.on("sendMessage", async (data, cb) => {
        const res = await storeMessage(data.token, data.message);
        if(res.error){
            return cb(true, {error:res.error});
        }
        io.to(data.message.roomId).emit("message", res.message);
    })
})


app.get("/", (req, res) => {
    res.status(404).send("That route doesn't exist for this api");
})

app.use("/api/v1/auth", require("./routes/Auth"));
app.use("/api/v1/chat", require("./routes/Chat"));
app.use("/api/v1/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));