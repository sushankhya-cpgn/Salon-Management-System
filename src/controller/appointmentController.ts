import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";


const convertToDate = (date:string,startTime:string,duration:number):[startAt:Date,endAt:Date]=>{

    const startAt = new Date(`${date}T${startTime}:00`);
    const endAt = new Date(startAt.getTime() + duration * 60000);

    return [startAt,endAt];


}
export const createAppointment = async(req:Request,res:Response)=>{
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
        const [startAt,endAt] = convertToDate(date,startTime,service.duration);

        try{
            const appointment = await prisma.$transaction(async(tx)=>{
                //Check for conflictng appointments
                const conflict = await tx.appointment.findFirst({
                    where:{
                        serviceId: Number(serviceId),
                        startTime: {lt:endAt},
                        endTime:{gt:startAt}
                    }
                })
               
                if (conflict) {
                    throw new Error("SLOT_ALREADY_BOOKED");
                }

                return tx.appointment.create({
                    data:{
                        customerName,
                        email,
                        startTime:startAt,
                        endTime:endAt,
                        serviceId
                    }
                })
            });

            return res.status(201).json({message:"Appointment created succesfully",appointment});
            
        }

        catch (error: any) {
            if (error.message === "SLOT_ALREADY_BOOKED") {
            return res.status(409).json({ message: "Slot already booked" });
            }

            console.error(error);
            return res.status(500).json({ message: "Something went wrong", error });
        }
    }
     

export const updateAppointment = async(req:Request,res:Response)=>{
    try{
        const {id} = req.params;
        const {customerName,email,startTime,serviceId} = req.body;
        const appointment = await prisma.appointment.update({
            where:{id:Number(id)},
            data:{
                customerName: customerName,
                email: email ?? null,
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

export const deleteAppointment = async(req:Request,res:Response)=>{

    const {id} = req.body;
    try{ 
        if(!id){
            return res.status(400).json({message:"Missing ID"});
        }
        await prisma.appointment.delete({
            where:{id:Number(id)}
        })
    }
    catch(error){
        res.status(500).json({message:"Something went wrong",error:error})
    }
}

 