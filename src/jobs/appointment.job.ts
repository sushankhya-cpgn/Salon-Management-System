import { appointmentQueue } from "../queue/appointment.queue.ts";

export const addAppointmentJob = async(data:any)=>{
    console.log(`Enqueuing 'process-csv' job for ${data}`);
    await appointmentQueue.add("process-csv",data,{
        attempts:3,
        backoff:{
            type:"exponential",
            delay:5000,
        }
    })
}