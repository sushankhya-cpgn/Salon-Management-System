import dotenv from "dotenv";
dotenv.config();

import { Job, Worker } from "bullmq";
import { redisConnection } from "../config/redis.ts";
import { sendEmail } from "../utils/sendMail.ts";
import { prisma } from "../lib/prisma.ts";
const emailWorker = new Worker(
    "emailQueue",
    async(job:Job)=>{

      switch(job.name){
        case "verify-email":
          await sendEmail(
            {
              email:job.data.email,
              subject:job.data.subject,
              message:job.data.message
            }
          );
          break;
          case "send-confirmation":
            await sendEmail(
            {
              email:job.data.email,
              subject:job.data.subject,
              message:`Your appointment ${job.data.email} is confirmed!!!`
            }

          );
           await prisma.appointment.update({
              where:{id:job.data.appointmentId},
              data:{status:"COMPLETED"}
          })
          break;
          default:
        throw new Error(`Unknown email job: ${job.name}`);
      }
    },
    {connection:redisConnection}
)

console.log(`Email worker started. Redis: ${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}`);

emailWorker.on('active', (job:Job) => {
  console.log(`Processing job ${job.id} - ${job.name}`);
});

emailWorker.on('completed', (job:Job) => {
  console.log(`${job.id} has completed!`);
});

emailWorker.on('failed', (job:Job, err:any) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

emailWorker.on('error', (err:any) => {
  console.error('Email worker error:', err);
});   