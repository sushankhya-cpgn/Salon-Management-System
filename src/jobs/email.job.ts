import { emailQueue } from "../queue/email.queue.js"


export const sendVerificationLink = async (data: {
    email: string,
    subject: string,
    message: string,
}) => {
    await emailQueue.add('verify-email',data,{
        attempts:3,
        jobId:`verify${data.email}`,
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
    await emailQueue.add('send-confirmation',data,{
        attempts:3,
        backoff:{
            type:"exponential",
            delay:5000,
        }
    })
}