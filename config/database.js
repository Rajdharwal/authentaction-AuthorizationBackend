const mongoose = require("mongoose");
require("dotenv").config();

exports.dbconnect = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{console.log("database connection successfully")})
    .catch((err) => console.error('Database connection error:', err));
    
}

// module.exports = dbconnect