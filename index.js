const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;

app.use(express.json());

//import route and mount
const user = require("./routes/user");
app.use("/api/v1", user);

require("./config/database").dbconnect();

app.listen(PORT, ()=>{
    console.log(`server is started on port no ${PORT}`);
    
})