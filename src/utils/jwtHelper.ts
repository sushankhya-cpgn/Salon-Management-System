import jwt from "jsonwebtoken"

interface JWT_TYPE {
    token?:string,
    payload: object,
    secretKey:string,
    options?: jwt.SignOptions; }

export function jwtGenerator({payload, secretKey, options}:JWT_TYPE){
    const token = jwt.sign(payload,secretKey,options)
    return token;
}

export function jwtVerify({token,secretKey}:JWT_TYPE){
    const payload = jwt.verify(token as string,secretKey);
    return payload;
}