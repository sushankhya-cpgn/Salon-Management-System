import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";


const convertToDate = (date: string, startTime: string, duration: number): [startAt: Date, endAt: Date] => {

    const startAt = new Date(`${date}T${startTime}:00`);
    const endAt = new Date(startAt.getTime() + duration * 60000);

    return [startAt, endAt];


}
export const createAppointment = async (req: Request, res: Response) => {
    const { customerName, email, date, startTime, serviceId } = req.body;
    if (!customerName || !date || !startTime || !serviceId) {
        return res.status(400).json({ message: "Missing required Fields" })
    }
    const service = await prisma.service.findUnique({
        where: {
            id: Number(serviceId)
        }
    })

    if (!service) {
        return res.status(400).json({ error: "Invalid Service" })
    }

    // watch this
    const [startAt, endAt] = convertToDate(date, startTime, service.duration);

    try {
        const appointment = await prisma.$transaction(async (tx:any) => {
            //Check for conflictng appointments
            const conflict = await tx.appointment.findFirst({
                where: {
                    serviceId: Number(serviceId),
                    startTime: { lt: endAt },
                    endTime: { gt: startAt }
                }
            })

            if (conflict) {
                throw new Error("SLOT_ALREADY_BOOKED");
            }

            return tx.appointment.create({
                data: {
                    customerName,
                    email,
                    startTime: startAt,
                    endTime: endAt,
                    serviceId
                }
            })
        });

        return res.status(201).json({ message: "Appointment created succesfully", appointment });

    }

    catch (error: any) {
        if (error.message === "SLOT_ALREADY_BOOKED") {
            return res.status(409).json({ message: "Slot already booked" });
        }

        console.error(error);
        return res.status(500).json({ message: "Something went wrong", error });
    }
}


export const updateAppointment = async (req: Request, res: Response) => {
    try {
        const {appointmentId} = req.params;
        console.log(appointmentId);
        const updates = req.body; // Only the fields to be updated are sent in the request body

        if (!appointmentId ) {
            return res.status(400).json({ message: "Missing Appointment ID" });
        }

        // Fetch existing appointment
        const existingAppointment = await prisma.appointment.findUnique({
            where: { id: Number(appointmentId ) },
        })

        if (!existingAppointment) {
            return res.status(404).json({ message: "No such appointment exists" });
        }
        // Initial Values of all parameters that need DB fetch operations
        let startAt = existingAppointment.startTime;
        let endAt = existingAppointment.endTime;
        let serviceDuration = 0;
        let serviceId = existingAppointment.serviceId;



        // If serviceId was updated, fetch new service to get duration
        if (updates.serviceId) {
            const service = await prisma.service.findUnique({
                where: { id: Number(updates.serviceId) }
            })
            if (!service) {
                return res.status(400).json({ message: "Invalid Service ID" });
            }
            serviceDuration = service.duration;
            serviceId = service.id;
        }
        // If not use existing service duration
        else {
            const service = await prisma.service.findUnique({
                where: { id: existingAppointment.serviceId }
            })
            serviceDuration = service ? service.duration : 0;
        }

        // If date, startTime or serviceId is updated, recalculate startAt and endAt 
        if (updates.startTime || updates.date || updates.serviceId) {
            const dateValue = updates.date ? updates.date : existingAppointment.startTime.toISOString().split('T')[0];
            const startTimeValue = updates.startTime ? updates.startTime : existingAppointment.startTime.toISOString().split('T')[1].substring(0, 5);
            [startAt, endAt] = convertToDate(dateValue, startTimeValue, serviceDuration)
            console.log("Time are", startAt,endAt);
        }

        // Checking for potential conflicts
        const updatedAppointment = await prisma.$transaction(async (tx: any) => {
            const conflict = await tx.appointment.findFirst({
                where: {
                    id: { not: Number(appointmentId ) },
                    serviceId: serviceId,
                    startTime: { lt: endAt },
                    endTime: { gt: startAt },
                },
            });
            if (conflict) {
                throw new Error("SLOT_ALREADY_BOOKED");
            }
            //Updating the DB
            return tx.appointment.update({
                where: { id: Number(appointmentId ) },
                data: {
                    customerName: updates.customerName ?? existingAppointment.customerName,
                    email: updates.email ?? existingAppointment.email,
                    serviceId: serviceId,
                    startTime: startAt,
                    endTime: endAt
                }
            
            })

        })

        return res.status(200).json({message:"Appointment Updated",updatedAppointment})

    }
    catch (error: any) {
        if (error.message === "SLOT_ALREADY_BOOKED") {
            return res.status(409).json({ message: "Slot is already booked" });
        }
        console.error(error);
        res.status(500).json({ message: "Something went wrong", error: error })

    }
}

export const deleteAppointment = async (req: Request, res: Response) => {
    const { appointmentId } = req.body;
    try {
        if (!appointmentId) {
            return res.status(400).json({ message: "Missing  ID" });
        }
        await prisma.appointment.delete({
            where: { id: Number(appointmentId) }
        })
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error })
    }
}

export const getAppointments = async (req: Request, res: Response) => {
    try {
        const appointments = await prisma.appointment.findMany();
        res.status(200).json({ appointments });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong", error: error })
    }
}
