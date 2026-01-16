import type { Request, Response } from "express";
import {prisma} from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import crypto from "crypto"
import { sendEmail } from "../utils/sendMail.js";
import { jwtGenerator } from "../utils/jwtHelper.js";


export const register = async function (req: Request, res: Response) {
    try {

        //Check if User Already Exists
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email
            }
        })

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create New User
        const verification_token = crypto.randomBytes(32).toString("hex");
        const verfication_link = `http://localhost:${process.env.PORT}/api/users/verify-email?token=${verification_token}`
        // Send Verification Link 
        const newUser = await prisma.user.create({
            data: {
                email: req.body.email,
                password: hashedPassword,
                name: req.body.name,
                verificationToken: verification_token
                
            }
        });
        sendEmail({email:req.body.email,subject:"Email Verification Link",message:verfication_link,isVerification:true})

        res.status(201).json({ message: "User registered successfully", user: { email: newUser.email, name: newUser.name } });

    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }

};

export const login = async function (req: Request, res: Response) {
    try{
        const user = await prisma.user.findFirst({
            where: {
                email: req.body.email
            }
        });

        if(!user){
            return  res.status(400).json({ message: "User Not Found" });
        }
        

          if (!user.isEmailVerified) {
            return res.status(403).json({ message: "Please verify your email before logging in." });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({ message: "Invalid Password" });
        }

        const token = jwtGenerator(
            {
            payload:{id: user.id, email: user.email }, 
            secretKey:process.env.JWT_SECRET as string, 
            options:{ expiresIn: '1h' }
            }
        )

        res.status(200).json({ message: "Login Successful", token } );
    }
    catch(error){
        console.error(error);
       res.status(500).json({ message: "Internal Server Error", error: error instanceof Error ? error.message : String(error) });

    }
}

export const verifyEmail = async(req:Request,res:Response)=>{
    try{
        const {token} = req.query;

        // Check if token exists and is valid
        if(!token || typeof token !=="string"){
            return res.status(400).json({message:"Invalid token"})
        }

        const user = await prisma.user.findFirst({ where: { verificationToken: token } });

        if(!user){
            return res.status(400).json({message:"Invalid Or Expired Token"})
        }

        await prisma.user.update({
            where:{
                id:user.id
            },
            data:{
                isEmailVerified:true,
                verificationToken:null 
            }
        });

        res.status(200).json({message:"Email Verified Successfully! You can now login"});

    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"Internal Server Error",error}); 
    }
}

