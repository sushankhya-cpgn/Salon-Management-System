import { Job, Worker } from "bullmq";
import { redisConnection } from "../config/redis.ts";
const emailWorker = new Worker(
    "email",
    async(job:Job)=>{
        console.log("Processing data",job.id,job.name);
        console.log("Job data:",job.data);

        // Simulate email sending
        await new Promise((resolve)=>setTimeout(resolve,1000));
        console.log(`Email sent to ${job.data.to}`)    


    },
    {connection:redisConnection}
)

emailWorker.on('completed', job => {
  console.log(`${job.id} has completed!`);
});

emailWorker.on('failed', (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
}); 