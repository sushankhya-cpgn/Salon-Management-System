import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.ts";

export const appointmentQueue = new Queue('appointmentQueue',{
    connection:redisConnection
})