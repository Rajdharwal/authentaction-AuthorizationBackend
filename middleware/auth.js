//isAdmin isStudent
const jwt = require("jsonwebtoken");
require("dotenv").config();

//auth
exports.auth = (req, res, next) =>{
    try {
        //extract jwt token
        //pending other ways to fetch jwt token header, cookie, body
        const token = req.body.token; 
        //or const {token} = req.body;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing",
            })
        }

        //verify token
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);

            req.body = payload;
            
            
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Token is invalid",
            })
            
        }

        next();
        
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success:false,
            message:"something went wrong, while verifying token",
        })
    }
}

//isStudent
exports.isStudent = (req, res, next)=>{
    try {
        if(req.body.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is Protected route for Student",
            })
        }
        next();
        
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"User role is not matching",
        })
        
    }
}

//isAdmin
exports.isAdmin = (req, res, next)=>{
    try {
        if(req.body.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is Protected route for Admin",
            })
        }
        next();
        
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"User role is not matching",
        })
    }
}

