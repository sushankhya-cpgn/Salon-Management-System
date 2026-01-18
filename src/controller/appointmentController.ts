import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const createAppointment = async(req:Request,res:Response)=>{
    try{
        const {customerName,email,date,startTime,serviceId} = req.body;
        if(!customerName || !date || !startTime || !serviceId){
            return res.status(400).json({message:"Missing required Fields"})
        }
        const service = await prisma.service.findUnique({
            where:{
                id:Number(serviceId)
            }
        })

        if(!service){
            return res.status(400).json({error:"Invalid Service"})
        }

        // watch this
        const startAt = new Date(`${date}T${startTime}:00`)
        const endAt = new Date(startAt.getTime() + service.duration * 60000);


       const appointment =  await prisma.appointment.create({
            data:{
                customerName: customerName,
                email: email ?? null,
                startTime: startAt,
                serviceId:Number(serviceId),
                endTime:endAt 
            }
        })

        return res.status(201).json({
      message: "Appointment created successfully",
      appointment
    });

    }
    
    catch(error){
        console.error(error);
        res.status(500).json({message:"Something went wrong", error})
    }

    
}
export const updateAppointment = async(req:Request,res:Response)=>{
    try{
        const {id} = req.params;
        const {customerName,email,date,startTime,serviceId} = req.body;
        const appointment = await prisma.appointment.update({
            where:{id:Number(id)},
            data:{
                customerName: customerName,
                email: email ?? null,
                date: date,
                startTime: startTime,
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

