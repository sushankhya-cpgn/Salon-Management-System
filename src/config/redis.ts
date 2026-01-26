import {Redis} from "ioredis";

export const redisConnection = new Redis({
    port: Number(process.env.REDIS_PORT)|| 6379,
    host: process.env.REDIS_HOST || '127.0.0.1',
    maxRetriesPerRequest:null
    
},)