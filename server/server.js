const express = require('express')
require('dotenv').config();
const app = express()
const cors = require('cors')
const menuRoutes = require('./routes/menuRoutes')
const orderRoutes = require('./routes/orderRoutes')


const PORT = process.env.PORT || 3000

app.use(cors())

app.get('/',(req,res)=>{
    res.send("Welcome to Chatbox app Backend");

})
app.get("/health", (req, res) => {
    res.send("OK");
});

app.use("/menu", menuRoutes)
app.use("/order", orderRoutes)


app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})