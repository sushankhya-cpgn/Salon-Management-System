import type { Request, Response } from "express";
import {prisma} from "../lib/prisma.js"


const generateSlots = (start:Date,end:Date,interval:number)=>{
    const slots = [];

    while(start <= end ){
        if(start.getHours()===12){
            start.setHours(start.getHours()+2)
            continue;
        }
        const formatted = ("0" + start.getHours()).slice(-2) + ":" + ("0"+ start.getMinutes()).slice(-2)+ ":" +("0"+start.getMilliseconds()).slice(-2); 
        slots.push(formatted);
        start.setMinutes(start.getMinutes() + 30);
    }
    
        return slots;

}

export const availableSlots = async(req:Request,res:Response)=>{
    try{
        const {serviceId} = req.params;
        console.log(serviceId);
        const existingAppointments = await prisma.appointment.findMany({where:{serviceId:Number(serviceId)}});
        const bookedTimes = existingAppointments.map((appointment)=>[appointment.startTime,appointment.endTime]);

        const service = await prisma.service.findUnique({
            where:{id:Number(serviceId)},
        });
        const interval = service?.duration; 
        const today = new Date();
        const startTime = new Date(today.setHours(9,0,0,0)); 
        const endTime = new Date(today.setHours(15,0,0,0));
        const slots = generateSlots(startTime,endTime,interval as number);
        res.status(200).json({message:slots,existingAppointments})

    }
    catch(error){
        res.status(500).json({message:"Something went wrong",error})
    }
}


//   "startTime": "2026-01-17T10:31:00.000Z",
//   "endTime": "2026-01-17T11:01:00.000Z",