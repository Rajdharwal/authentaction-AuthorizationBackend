const User  = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//singup handler
exports.signup = async(req, res) =>{
    try {
        //fetch data from req
    const {name, email, password,role} = req.body;
        console.log(role);
        
    //check if user already exist
    const existingUser = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"User already exists"
        })
    }
    
    //secure password
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"error in hashing password",
        })
        
    }

    //create entry in db
    const user = await User.create({
        name, email, password:hashedPassword,role:role
    });

    return res.status(200).json({
        success:true,
        data:user,
        message:"user created successfully",
    })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"user can not be registor, please try later"
        })
        
    }
}

//login handler

exports.login = async (req, res) =>{
    try {

        //fetch data from reqest body
        const {email, password} = req.body;
        //validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the details carefully"
            })
        }
        //check for register user 
        let user = await User.findOne({email});
        //if not register user 
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user is not registered"
            })
        }

        const payload = {
            email:user.email,
            id:user._id,
            role:user.role,
        }
        //verify password and generate jwt token
        if(await bcrypt.compare(password, user.password)){
            //password match
            let token = jwt.sign(payload,
                                process.env.JWT_SECRET,
                                {
                                    expiresIn:"2h"
                                });
                                
            user = user.toObject();  
            user.token = token;
            user.password = undefined;
            
        

        const options = {
            expiresIn: Date(Date.now() + 3*24*60*60*1000),
            httpOnly:true,
        }

        res.cookie("cookie", token, options).status(200).json({
            success:true,
            token,
            user,
            message:"user login successfully",

        })
    }
    else{
        // password do not match
        return res.status(403).json({
            success:false,
            message:"Password incorrect"
        })

    }
        
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"User not exist pls signup first"
        })
        
        
    }
}