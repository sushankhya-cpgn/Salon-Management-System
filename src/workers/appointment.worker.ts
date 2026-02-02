import dotenv from "dotenv";
dotenv.config();
import { Job, Worker } from "bullmq";
import fs from "fs";
import csv from "csv-parser"
import { prisma } from "../lib/prisma.js";
import { sendConfirmationEmailJob } from "../jobs/email.job.js";
import { redisConnection } from "../config/redis.js";

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
        for(const appt of appointment){
            await sendConfirmationEmailJob({
                email: appt.email,
                subject: "Appointment Confirmation",
                message: `Your appointment is confirmed.`,
        })
        }
        fs.unlinkSync(csv_path); // Delete the file
        return { processed: appointment.length };

        }

,{connection:redisConnection})

console.log(`Appointment worker started. Redis: ${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}`);


appointmentWorker.on('active', (job:Job) => {
  console.log(`Processing job ${job.id} - ${job.name}`);
});

appointmentWorker.on('completed', (job:Job) => {
  console.log(`${job.id} has completed!`);
});

appointmentWorker.on('failed', (job:Job, err:any) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

appointmentWorker.on('error', (err:any) => {
  console.error('Email worker error:', err);
});   