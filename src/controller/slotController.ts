import type { Request, Response } from "express";
import {prisma} from "../lib/prisma.js"
import { formatTime } from "../utils/timehelper.js";


const generateSlots = (start:Date,end:Date,interval:number, bookedTimes:Date[][])=>{
    let slots = [];
    const booked_slots:String[] = [];
    const current = new Date(start);
    while(current <= end ){
        if(current.getHours()>=12 && current.getHours()<14){
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
            currentDate.setMinutes(currentDate.getMinutes() + interval);
        }
       })

       slots = slots.filter((slot)=>!booked_slots.includes(slot));
    return slots;
}    

export const availableSlots = async(req:Request,res:Response)=>{
    try{
        const {serviceId} = req.params;
        const {date} = req.query;
        
        // Validate serviceId
        if (!serviceId) {
            return res.status(400).json({message: "Service ID is required"});
        }

        // Get service
        const service = await prisma.service.findUnique({
            where:{id:Number(serviceId)},
        });
        
        if (!service) {
            return res.status(404).json({message: "Service not found"});
        }

        // Determine the date to check
        let targetDate: Date;
        if (date && typeof date === 'string') {
            // Parse provided date (format: YYYY-MM-DD)
            targetDate = new Date(date);
            
            // Validate date format
            if (isNaN(targetDate.getTime())) {
                return res.status(400).json({message: "Invalid date format. Use YYYY-MM-DD"});
            }
        } else {
            // Use today's date if no date provided
            targetDate = new Date();
        }

        // Set time boundaries (9 AM to 3 PM)
        const startTime = new Date(targetDate);
        startTime.setHours(9, 0, 0, 0);
        
        const endTime = new Date(targetDate);
        endTime.setHours(15, 0, 0, 0);

        // Get all appointments for this service on the specific date
        const existingAppointments = await prisma.appointment.findMany({
            where: {
                serviceId: Number(serviceId),
                startTime: {
                    gte: startTime,
                    lt: new Date(endTime.getTime() + 24 * 60 * 60 * 1000) // Include until end of day
                }
            }
        });

        const bookedTimes = existingAppointments.map((appointment)=>[appointment.startTime, appointment.endTime]);
        const interval = service.duration;
        
        const slots = generateSlots(startTime, endTime, interval, bookedTimes);
        
        res.status(200).json({
            message: slots,
            date: targetDate.toISOString().split('T')[0],
            serviceId: serviceId,
            serviceName: service.name
        });

    }
    catch(error){
        res.status(500).json({message:"Something went wrong",error})
    }
}


