import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const appointmentQueue = new Queue('appointmentQueue',{
    connection:redisConnection
})