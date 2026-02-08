import dotenv from "dotenv";
dotenv.config();
import { Job, Worker } from "bullmq";
import fs from "fs";
import csv from "csv-parser"
import { prisma } from "../lib/prisma.ts";
import { sendConfirmationEmailJob } from "../jobs/email.job.ts";
import { redisConnection } from "../config/redis.ts";
import { convertToDate } from "../controller/appointmentController.ts";



async function processBatch(batch: any[]) {
  // Check for conflicts before insertion
  const validAppointments = [];
  
  for (const appt of batch) {
    const conflict = await prisma.appointment.findFirst({
      where: {
        serviceId: appt.serviceId,
        startTime: { lt: appt.endTime },
        endTime: { gt: appt.startTime }
      }
    });
    
    if (!conflict) {
      validAppointments.push(appt);
    } else {
      console.log(`Skipping appointment for ${appt.customerName}: Slot already booked`);
    }
  }

  if (validAppointments.length === 0) return;

  // Insert only valid appointments
  const insertedAppointments = await prisma.$transaction(
    validAppointments.map((appt) =>
      prisma.appointment.create({ data: appt })
    )

  );

  // enqueue email jobs
  for (const appt of insertedAppointments) {
      const key = `${appt.serviceId}-${appt.startTime.toISOString()}`;
    if (appt.email) {
      await sendConfirmationEmailJob({
        appointmentId: appt.id,
        email: appt.email,
        subject: "Appointment Confirmation",
        message: `Your appointment (ID: ${appt.id}) is confirmed!`,
      });
    }
  }

  console.log(`Processed batch of ${validAppointments.length} valid appointments out of ${batch.length}`);
}

const appointmentWorker = new Worker("appointmentQueue",
  async (job: Job) => {

    const csv_path = job.data;
    console.log("Reached here")
    // Read stream
    const stream = fs.createReadStream(csv_path).pipe(csv());
    const batch_size = 1000;
    let batch: any[] = []


    for await (const row of stream) {
      let { customerName, email, date, startTime, serviceId } = row;
      const service = await prisma.service.findFirst({
        where: { id: Number(serviceId) }
      });
      if (!service) continue;
      const [startAt, endAt] = convertToDate(date, startTime, service?.duration as number)
      serviceId = Number(serviceId);
      
      batch.push({ customerName, email, startTime: startAt, serviceId, endTime: endAt });

      if (batch.length === batch_size) {
        await processBatch(batch);
        batch = [];
      }
      console.log("Appointment CSV processing complete!");
    }

    if (batch.length) {
      await processBatch(batch);
    }
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