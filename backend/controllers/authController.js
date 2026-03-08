import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import imagekit from '../config/imagekit.js';
import crypto from 'crypto';
import sendMail from '../utils/sendMail.js';

dotenv.config();

const createToken= (userId)=>{
    //token creation logic will be implemented here
    return Jwt.sign({id:userId},process.env.jwt_secret,{
        expiresIn:process.env.jwt_expiresIn,
    });
}

const signup = async(req,res) => {
    try {
        const {name,email,password,avatar} = req.body;//destructuring user details from request body

        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const existingUser=await User.findOne({email : email});//checking if a user with the given email already exists
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }

        let avatarurl = "";
        if(avatar){
            const uploadResponce = await imagekit.upload({ //uploading avatar to imagekit
                file: avatar,
                fileName: `avatar_${Date.now()}.jpg`, //generating a unique filename using timestamp
                folder: "/mern-music-app"//specifying folder in imagekit
            });
            avatarurl = uploadResponce.url;
        }

        const user = await User.create({//creating a new user in the database
            name,
            email,
            password,
            avatar: avatarurl
        });

        const token = createToken(user._id);
        res.status(201).json({message:"user created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            },
            token,
        });
    
    } catch (error) {
        res.status(500).json({message:"signup failed"});
    }
};

const login = async(req,res) => {
    //login logic will be implemented here
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({message:"all fields are required"});
    }
    try{
        const findUser= await User.findOne({email:email});
        if(findUser){
            //password verification logic will be added here
            const ismatched= await bcrypt.compare(password,findUser.password);
            if(ismatched){
                const token=createToken(findUser._id);
                return res.status(200).json({message:"login successful",
                user: {
                    id: findUser._id,
                    name: findUser.name,
                    email: findUser.email,
                    avatar: findUser.avatar
                },
                token,
            });
                
            }else{
                return res.status(400).json({message:"invalid credentials"});
            }
        }else{
            return res.status(400).json({message:"user not found"});
        }
    }
    catch(error){
        console.error("Login error:", error.message);
        res.status(500).json({message:"login failed"});
    } 
};

const getme=async(req,res)=>{
    //getme logic will be implemented here
    if(!req.user){
        return res.status(401).json({message:"Unauthorized access"});
    }
    console.log("hello from getme");
    res.status(200).json({message:"Authorized access",user:req.user});
};  


const forgotPassword = async(req,res) => {
    //forgot password logic will be implemented here
    try {
        const {email} = req.body;
        if(!email){
            return res.status(400).json({message:"Email is required"});
        }
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }   
        //generate a token
        const resetToken= crypto.randomBytes(32).toString('hex');
        //hash token before saving to database
        const hashedToken= crypto.createHash('sha256').update(resetToken).digest('hex'); 
        
        user.resetPasswordToken= hashedToken;
        user.resetPasswordTokenExpires= Date.now() + 10*60*1000; //token valid for 10 minutes
        await user.save();
        const resetUrl=`${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        //send email logic will be implemented here

        await sendMail({
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>You requested for password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 10 minutes.</p>`
        });
        res.status(200).json({message:"Password reset email sent"});
    } catch (error) {
        console.error("Forgot Password error:", error.message);
        res.status(500).json({message:"Failed to send password reset email"});
    }
};

const resetPassword = async(req,res) => {
   try {
     //reset password logic will be implemented here
    const {token}= req.params;
    const {password}= req.body;

    if(!password || password.length<6){
        return res.status(400).json({message:"Token and new password are required"});
    }
    const hashedToken= crypto.createHash('sha256').update(token).digest('hex');
    const user= await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpires: {$gt: Date.now()},
    });
    if(!user){
        return res.status(400).json({message:"Invalid or expired token"});
    }
    user.password= password;
    user.resetPasswordToken= undefined;
    user.resetPasswordTokenExpires= undefined;
    await user.save();
    res.status(200).json({message:"Password reset successful"});
   } catch (error) {
       console.error("Reset Password error:", error.message);
         res.status(500).json({message:"Password reset failed"});
   }
};


const editProfile= async(req,res)=>{
    //edit profile logic will be implemented here
     try {
        const userId=req.user._id;
        if(!userId){
            return res.status(401).json({message:"Unauthorized access"});
        }
        const {name,email,avatar,currentPassword,newPassword}= req.body;
        const user= await User.findById(userId);
        if(name){
            user.name= name;
        }
        if(email){
            user.email= email;
        }   
        if(currentPassword || newPassword){
            if(!currentPassword || !newPassword){
                return res.status(400).json({message:"Both current and new passwords are required"});
            }
            const isMatch = await user.comparePassword(currentPassword);
            if(!isMatch){
                return res.status(400).json({message:"Current password is incorrect"});
            }
            if(newPassword.length<6){
                return res.status(400).json({message:"New password must be at least 6 characters long"});
            }
            user.password= newPassword;
        }
        if(avatar){
            const uploadResponse = await imagekit.upload({ //uploading avatar to imagekit
                file: avatar,
                fileName: `avatar_${userId}_${Date.now()}.jpg`, //generating a unique filename using timestamp
                folder: "/mern-music-app"//specifying folder in imagekit
            });
            user.avatar = uploadResponse.url;
        }
        await user.save();
        res.status(200).json({message:"Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        })
}catch (error) {
    console.error("Edit Profile error:", error.message);
    res.status(500).json({message:"Profile update failed"});
    }

};
export {signup, login, getme, forgotPassword,resetPassword,editProfile};



