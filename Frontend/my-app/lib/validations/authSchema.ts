import {email, z} from "zod";

export const loginSchema = z.object({
    email: z.email("Enter Valid Emaill Address"),
    password: z.string().min(6,"Password must be at least six character long")
});

export const registerSchema = z.object({
    name:z.string(),
    email: z.email("Enter Valid Emaill Address"),
    password: z.string().min(6,"Password must be at least six character long"),
    confirmPassword: z.string()
}).refine((data)=>data.password === data.confirmPassword,{
    message:"Passwords do not match",
    path:["confirmPassword"]
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>