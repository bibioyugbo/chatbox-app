const express = require('express')
require('dotenv').config();
const app = express()

const PORT = process.env.PORT || 3000


app.get('/',(req,res)=>{
    res.send("Welcome to Chatbox app Backend");

})
app.get("/health", (req, res) => {
    res.send("OK");
});

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})