"use-client";

import { useRouter } from "next/router";
import * as React from "react";
import { useState } from "react";
import axios from "axios";


export function useLogin(){
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [error,setError] = useState<string | null>(null);

    const login = async (email: string, password: string) => {
        try{
            setLoading(true);
            setError("");
            const response = await axios.post("/api/auth/login",{email,password});
            const { token, refreshToken} = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("refresh_token", refreshToken);
            router.push("/");
        }
        catch(err: any){
            setError(err.message);
        }
    }


    return {login, loading, error};

}