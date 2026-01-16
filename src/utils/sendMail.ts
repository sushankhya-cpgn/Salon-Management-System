import nodemailer from "nodemailer"

interface emailType{
    email:string,
    subject:string,
    message:string
    isVerification?:Boolean
}

export const sendEmail = async({email,subject,message,isVerification}:emailType):Promise<void>=>{
    try{
        if(!process.env.HOST || !process.env.PASS){
            throw new Error('Missing SMTP credentials. Ensure HOST and PASS are set in environment variables.');
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use TLS
            auth: {
                user: process.env.HOST,
                pass: process.env.PASS
            }
        })

        // Verify connection configuration and surface auth/connectivity errors early
        await transporter.verify()

        await transporter.sendMail({
            from: process.env.HOST,
            to: email,
            subject: subject,
            html: isVerification? `Click on the link ${message} to verify`:message
        })
    }
    catch(error){
        console.error('sendEmail error:', (error as any)?.response || (error as any)?.message || error)
        throw error;
    }
}