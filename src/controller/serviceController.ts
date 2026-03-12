import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const getService = async(req:Request,res:Response)=> {

    try{
        
        const service = await prisma.service.findMany();
        console.log(service)
        return res.status(200).json({message:"Data fetched",data:service})
    }

    catch(error){
         return res.status(500).json({message:error})
    }
    
}