import type { Request, Response } from "express";
import {prisma} from "../lib/prisma.js"
import { formatTime } from "../utils/timehelper.js";


const generateSlots = (start:Date,end:Date,interval:number, bookedTimes:Date[][])=>{
    let slots = [];
    const booked_slots:String[] = [];
    const current = new Date(start);
    while(current <= end ){
        if(current.getHours()===12){
            current.setHours(14,0,0,0)
            continue;
        }
        slots.push(formatTime(current));
        current.setMinutes(current.getMinutes() + interval);
    }
       bookedTimes.forEach((range:any)=>{
        const currentDate = new Date(range[0]);
        const endDate = new Date(range[1]);
        while(currentDate<endDate){
            booked_slots.push(formatTime(currentDate));
            currentDate.setMinutes(interval+currentDate.getMinutes());
        }
       })

       slots = slots.filter((slot)=>!booked_slots.includes(slot));
    return slots;
}    

export const availableSlots = async(req:Request,res:Response)=>{
    try{
        const {serviceId} = req.params;
        const existingAppointments = await prisma.appointment.findMany({where:{serviceId:Number(serviceId)}});
        const bookedTimes = existingAppointments.map((appointment)=>[appointment.startTime,appointment.endTime]);
        const service = await prisma.service.findUnique({
            where:{id:Number(serviceId)},
        });
        const interval = service?.duration; 
        const today = new Date();
        const startTime = new Date(today.setHours(9,0,0,0)); 
        const endTime = new Date(today.setHours(15,0,0,0));
        const slots = generateSlots(startTime,endTime,interval as number, bookedTimes);
        res.status(200).json({message:slots})

    }
    catch(error){
        res.status(500).json({message:"Something went wrong",error})
    }
}


