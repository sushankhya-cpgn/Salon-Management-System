import jwt from "jsonwebtoken"

interface JWT_TYPE {
    payload: object,
    secretKey:string,
    options?: jwt.SignOptions; }

export function jwtGenerator({payload, secretKey, options}:JWT_TYPE){
    const token = jwt.sign(payload,secretKey,options)
    return token;
}