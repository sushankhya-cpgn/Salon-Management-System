import { emailQueue } from "../queue/email.queue.ts"


export const sendVerificationLink = async (data: {
    email: string,
    subject: string,
    message: string,
}) => {
    console.log(`Enqueuing 'verify-email' job for ${data.email}`);
    await emailQueue.add('verify-email',data,{
        attempts:3,
        backoff:{
            type:"exponential",
            delay:5000,
        }
    })
}

export const sendConfirmationEmailJob = async(data:{
    email:string,
    subject: string,
    message:string
})=>{
    console.log(`Enqueuing 'send-confirmation' job for ${data.email}`);
    await emailQueue.add('send-confirmation',data,{
        attempts:3,
        backoff:{
            type:"exponential",
            delay:5000,
        }
    })
}