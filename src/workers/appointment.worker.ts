import { Job, Worker } from "bullmq";
import fs from "fs";
import csv from "csv-parser"
import { prisma } from "../lib/prisma.js";
import { addAppointmentJob } from "../jobs/appointment.job.js";

const appointmentWorker = new Worker("appointmentQueue",
    async(job:Job) => {
        const csv_path = job.data;

        const appointment:any = [];


        await new Promise((resolve,reject)=>{
            fs.createReadStream(csv_path).pipe(csv()).on('data',(row:any)=>
            {
                const {customerName,email,startTime,endTime,serviceId} = row;
                if(!customerName || !email || !startTime || !endTime || !serviceId) return;

                appointment.push({
                    customerName,
                    email,
                    startTime,
                    endTime,
                    serviceId,
                    status:"PENDING"
                });

            }
            ).on("end",resolve).on("error",reject);
        })
        
        const created = await prisma.appointment.createMany({
            data:appointment
        })
        // Add appointment to queue
        //Complete it
        for(const appi of appointment){
            await addAppointmentJob(appi)
        }

    }
)