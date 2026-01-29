import { appointmentQueue } from "../queue/appointment.queue.js";

export const addAppointmentJob = async(data:any)=>{
    await appointmentQueue.add("appointment-confirmation",data,{
        attempts:3,
        backoff:{
            type:"exponential",
            delay:5000,
        }
    })
}