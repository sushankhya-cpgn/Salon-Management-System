import type { Request, Response } from "express";
import {prisma} from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import crypto from "crypto"
import { jwtGenerator, jwtVerify } from "../utils/jwtHelper.js";
import {  sendVerificationLink } from "../jobs/email.job.js";


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
        sendVerificationLink({email:req.body.email,subject:"Email Verification Link",message:verfication_link})

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

        const refreshToken = jwtGenerator({
            payload:{id:user.id, email:user.email},
            secretKey: process.env.REFRESH_TOKEN_SECRET as string,
            options:{expiresIn:'9d'}
            
        })

        await prisma.UserSessions.create({
            data:{
                userId:user.id,
                refreshTokenHashed:refreshToken,
                expiresAt: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
                ipAddress:req.ip

            }
        })

        return res.status(200).json({ message: "Login Successful", data:{token,refreshToken} } );
    }
    catch(error){
        console.error(error);
       res.status(500).json({ message: "Internal Server Error", error: error instanceof Error ? error.message : String(error) });

    }
}

export const logout = async function(req:Request,res:Response){
    try{
        await prisma.userSessions.deleteMany({
            where:{userId:req.user.id}
        })

    }
    catch(error){
        console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const refreshToken = async function(req:Request,res:Response){
    try{
        const refreshToken = req.body.refreshToken 

        if(!refreshToken){
            return res.status(401).json({message:"Refresh Token Missing"});
        }
               
        // jwt
        const user = jwtVerify({token:refreshToken,secretKey:process.env.REFRESH_TOKEN_SECRET})
        console.log(user);
        
        const session= await prisma.UserSessions.findFirst({
            where:{
                userId:user.id,
                refreshTokenHashed: refreshToken

            }
        })

        if(!session){
            return res.status(403).json({message:"Invalid Refresh Token"})
        }
       const accessToken =  jwtGenerator(
            {
            payload:{id: user.id, email: user.email }, 
            secretKey:process.env.JWT_SECRET as string, 
            options:{ expiresIn: '1h' }
            }
        )

        const new_refreshToken = jwtGenerator(
            {
            payload:{id: user.id, email: user.email }, 
            secretKey:process.env.REFRESH_TOKEN_SECRET as string, 
            options:{ expiresIn: '9d' }
            }
        )

        await prisma.userSessions.update({
            where:{id:session.id},
            data:{
                refreshTokenHashed:new_refreshToken
            }
        })
        return res.status(200).json({data:{accessToken,refreshToken:new_refreshToken}})

    }
    catch(error){
        return res.status(500).json({message:"Something went wrong",error:error})
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

