import { emailQueue } from "../queue/email.queue.js"


export const addEmailJob = async (data: {
    email: string,
    subject: string,
    message: string,
    isVerification:Boolean
}) => {
    await emailQueue.add('send-email',data,{
        attempts:3,
        backoff:{
            type:"exponential",
            delay:5000,
        }
    })
}