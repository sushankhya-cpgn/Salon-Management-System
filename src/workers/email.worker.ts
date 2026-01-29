import { Job, Worker } from "bullmq";
import { redisConnection } from "../config/redis.ts";
import { sendEmail } from "../utils/sendMail.ts";
const emailWorker = new Worker(
    "emailQueue",
    async(job:Job)=>{
       const {email,subject,message,isVerification} = job.data;
       await sendEmail({email,subject,message,isVerification})
    },
    {connection:redisConnection}
)

emailWorker.on('completed', (job:Job) => {
  console.log(`${job.id} has completed!`);
});

emailWorker.on('failed', (job:Job, err:any) => {
  console.log(`${job.id} has failed with ${err.message}`);
});   