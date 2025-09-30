const express = require('express')
require('dotenv').config();
const app = express()
const path = require('path')

const cors = require('cors')
const menuRoutes = require('./routes/menuRoutes')
const orderRoutes = require('./routes/orderRoutes')
const {connectDB} = require("./config/database");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3000

app.use(cors({
    origin: "http://localhost:5173", // or your frontend URL
    credentials: true, // ✅ allow cookies to be sent
}
))



app.use(express.json());
app.use(cookieParser());

connectDB();

app.get('/',(req,res)=>{
    res.send("Welcome to Chatbox app Backend");

})
app.get("/health", (req, res) => {
    res.send("OK");
});

app.use("/menu", menuRoutes)
app.use("/order", orderRoutes)

app.use(express.static(path.join(__dirname, "client/dist")));

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})