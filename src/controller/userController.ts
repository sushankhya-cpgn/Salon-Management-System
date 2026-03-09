import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";



export const getUser = async (req:Request, res:Response) => {

    try{
        const userId = req.params.id;
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) }
        })
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.json({message:"User retrieved successfully", data:{email:user.email,name:user.name}});
    }
    catch(error){
        console.error(error);
       res.status(500).json({ message: "Internal Server Error", error: error instanceof Error ? error.message : String(error) });   
    }
}

export const getAllUsers = async(req:Request,res:Response)=>{
    try{
        const users = await prisma.user.findMany({
            select:{id:true,email:true,name:true}
        })
       return res.json({message:"Users retrieved successfully", data:users});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error: error instanceof Error ? error.message : String(error) });
    }
}

export const updateUser = async(req:Request,res:Response)=>{
    try{
        const userId = req.params.id;
        const {name} = req.body;
        const user = await prisma.user.update({
            where: { id: Number(userId)},
            data: {name}
        })

        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.json({message:"User updated successfully", data:user});

    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error: error instanceof Error ? error.message : String(error) });
    }
}

export const deleteUser = async(req:Request,res:Response)=>{
    try{
        const userId = req.params.id;
        const user = await prisma.user.delete({
            where: { id : Number(userId)}
        })
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.json({message:"User deleted successfully"});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error: error instanceof Error ? error.message : String(error) });
    }
}

