import dotenv from "dotenv";
dotenv.config();
import { Job, Worker } from "bullmq";
import fs from "fs";
import csv from "csv-parser"
import { prisma } from "../lib/prisma.ts";
import { sendConfirmationEmailJob } from "../jobs/email.job.ts";
import { redisConnection } from "../config/redis.ts";

const appointmentWorker = new Worker("appointmentQueue",
    async (job: Job) => {

        const csv_path = job.data;
        console.log("Reached here")
        const appointment: any = [];
        await new Promise((resolve, reject) => {
            fs.createReadStream(csv_path).pipe(csv()).on('data', (row: any) => {
                const { customerName, email, startTime, endTime, serviceId } = row;
                if (!customerName || !email || !startTime || !endTime || !serviceId) {
                    console.warn("Invalid row skipped:", row);
                    return;
                }
                console.log(customerName, email, startTime, endTime, serviceId)
                appointment.push({
                    customerName,
                    email,
                    startTime: new Date(startTime),
                    endTime: new Date(endTime),
                    serviceId: Number(serviceId),
                    status: "PENDING"
                });

            }
            ).on("end", resolve).on("error", reject);
        })

        const created = await prisma.appointment.createMany({
            data: appointment
        })
        for (const appt of appointment) {
            await sendConfirmationEmailJob({
                email: appt.email,
                subject: "Appointment Confirmation",
                message: `Your appointment is confirmed.`,
            })
        }
        fs.unlinkSync(csv_path); // Delete the file
        return { processed: appointment.length };

    }

    , { connection: redisConnection })

console.log(`Appointment worker started. Redis: ${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}`);


appointmentWorker.on('active', (job: Job) => {
    console.log(`Processing job ${job.id} - ${job.name}`);
});

appointmentWorker.on('completed', (job: Job) => {
    console.log(`${job.id} has completed!`);
});

appointmentWorker.on('failed', (job: Job, err: any) => {
    console.log(`${job.id} has failed with ${err.message}`);
});

appointmentWorker.on('error', (err: any) => {
    console.error('Email worker error:', err);
});   