import { appointmentQueue } from "../queue/appointment.queue.js";

export const addAppointmentJob = async(data:any)=>{
    await appointmentQueue.add("process-csv",data,{
        attempts:3,
        backoff:{
            type:"exponential",
            delay:5000,
        }
    })
}