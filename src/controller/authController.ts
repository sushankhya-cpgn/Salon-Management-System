import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const register = async function (req: Request, res: Response) {
    try {

        //Check if User Already Exists
        const user = await prisma.user.findFirst({
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
        const newUser = await prisma.user.create({
            data: {
                email: req.body.email,
                password: hashedPassword,
                name: req.body.name
            }
        });

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

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({ message: "Invalid Password" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        res.status(200).json({ message: "Login Successful", token } );
    }
    catch(error){
        res.status(500).json({ message: "Internal Server Error", error });
    }
}