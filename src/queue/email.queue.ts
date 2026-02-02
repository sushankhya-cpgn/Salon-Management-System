import {Queue} from "bullmq"
import { redisConnection } from "../config/redis.ts"

export const emailQueue = new Queue('emailQueue',{
    connection: redisConnection
})