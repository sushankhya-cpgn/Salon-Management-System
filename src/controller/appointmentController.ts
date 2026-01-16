import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const createAppointment = (req:Request,res:Response)=>{
    try{
        const {customerName,email,date,startTime,endTime,serviceId} = req.body;
        if(!customerName || !date || !startTime || !endTime || !serviceId){
            return res.status(400).json({message:"Missing required Fields"})
        }
        const service = prisma.service.findUnique({
            where:{
                id:Number(serviceId)
            }
        })

        if(!service){
            return res.status(400).json({error:"Invalid Service"})
        }

        prisma.appointment.create({
            data:{
                customerName: customerName,
                email: email,
                date: date,
                startTime: startTime,
                endTime:endTime,
                serviceId:serviceId
            }
        })

    }
    
    catch(error){
        console.error(error);
        res.status(500).json({message:"Something went wrong", error})
    }

    
}
export const updateAppointment = async(req:Request,res:Response)=>{
    try{
        const {id} = req.params;
        const {customerName,email,date,startTime,endTime,serviceId} = req.body;
        const appointment = await prisma.appointment.update({
            where:{id:Number(id)},
            data:{
                customerName: customerName,
                email: email,
                date: date,
                startTime: startTime,
                endTime:endTime,
                serviceId:serviceId
            }
        })

        res.status(200).json({message:"Appointment Updated",appointment})
        
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"Something went wrong",error:error})
        
    }
}