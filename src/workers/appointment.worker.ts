import dotenv from "dotenv";
dotenv.config();
import { Job, Worker } from "bullmq";
import fs from "fs";
import csv from "csv-parser"
import { prisma } from "../lib/prisma.ts";
import { sendConfirmationEmailJob } from "../jobs/email.job.ts";
import { redisConnection } from "../config/redis.ts";
import { convertToDate } from "../controller/appointmentController.ts";

const appointmentWorker = new Worker("appointmentQueue",
    async (job: Job) => {

        const csv_path = job.data;
        console.log("Reached here")
        const appointment: any = [];
        // await new Promise((resolve, reject) => {
        //     fs.createReadStream(csv_path).pipe(csv()).on('data', (row: any) => {
        //         const { customerName, email, startTime, date, serviceId } = row;
        //         if (!customerName || !email || !startTime || !date || !serviceId) {
        //             console.warn("Invalid row skipped:", row);
        //             return;
        //         }
        //         const service = await prisma.service.findUnique({
        //             where:{id:Number(serviceId)}
        //         })
        //         const duration = service?.duration as number;
        //         const [startAt,endAt] = convertToDate(date,startTime,duration);
        //         console.log(customerName, email, startTime, date, serviceId)
        //         appointment.push({
        //             customerName,
        //             email,
        //             startTime: startAt,
        //             endTime: endAt,
        //             serviceId: serviceId,
        //             status: "PENDING"
        //         });

        //     }
        //     ).on("end", resolve).on("error", reject);
        // })

        await new Promise<void>((resolve, reject) => {
  const stream = fs.createReadStream(csv_path).pipe(csv());

  stream.on('data', async (row: any) => {
    stream.pause(); // ⛔ STOP reading new rows

    try {
      const { customerName, email, startTime, date, serviceId } = row;
      if (!customerName || !email || !startTime || !date || !serviceId) {
        console.warn("Invalid row skipped:", row);
        stream.resume();
        return;
      }

      const service = await prisma.service.findUnique({
        where: { id: Number(serviceId) }
      });

      if (!service) {
        console.warn("Service not found:", serviceId);
        stream.resume();
        return;
      }

      const duration = service.duration;
      const [startAt, endAt] = convertToDate(date, startTime, duration);

      appointment.push({
        customerName,
        email,
        startTime: startAt,
        endTime: endAt,
        serviceId: Number(serviceId),
        status: "PENDING"
      });

      stream.resume(); // ▶ continue reading

    } catch (err) {
      stream.resume();
      reject(err);
    }
  });

  stream.on('end', resolve);
  stream.on('error', reject);
});


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