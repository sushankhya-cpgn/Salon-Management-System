import nodemailer from "nodemailer"

interface emailType{
    email:string,
    subject:string,
    message:string
}

export const sendEmail = async({email,subject,message}:emailType):Promise<void>=>{
    try{
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.HOST,
                pass: process.env.PASS
                
            }
            
        })
        await transporter.sendMail({
            from: process.env.HOST,
            to: email,
            subject: subject,
            html: message
        })
    }
    catch(error){
        console.log(error);
        throw(error);
    }
}