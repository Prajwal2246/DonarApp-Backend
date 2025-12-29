import User from "../models/User.models.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const registerUser = async (req,res)=>{
    try {
        const {email,password,name,phoneNumber}= req.body;
        
        //check if user exists already in db
        const  existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exist."});
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password,10);

        //create a user
        const newUser = new User({
            name,
            email,
            password:hashedPassword,
            phoneNumber
        }); 

        await newUser.save();

        res.status(201).json({
            message:"User registered succesfully",
            user:newUser
        });
        
    } catch (error) {
        res.status(400).json({error:"Server error",details:error})
    }
}

export const loginUser = async(req,res)=>{
    try {
        const {email,password}=req.body;
        console.log(email);
        const user = await User.findOne({email});
        console.log(user);
        
        if(!user){
            return res.status(404).json({message:"No User Found"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({message:"Incorrect Password or email"});
        }

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn:"7d",
        });

        res.status(200).json({
            message:"login successfull",
            token,
            user,
        });

    } catch (error) {
        console.error("login error",error);
    }
}

