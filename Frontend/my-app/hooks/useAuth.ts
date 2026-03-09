import { useState } from "react";
import { useRouter } from "next/navigation";
import { login as loginApi } from "@/lib/api/auth";
import { register as registerApi } from "@/lib/api/auth";
import { LoginInput, RegisterInput } from "@/lib/validations/authSchema";

export function useAuth() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message,setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (data: LoginInput) => {
    setError(null);
    setLoading(true);
    try {
      const result = await loginApi(data);
      localStorage.setItem('accessToken', result.data.token);
      localStorage.setItem('refreshToken', result.data.refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async(data:RegisterInput) =>{
    setError(null);
    setLoading(true);
    try{
        const result = await registerApi(data);
        setMessage(result.message)
    }
    catch(err:any){
         setError(err?.response?.data?.message || err.message || 'Login failed');

    }
    finally{
      setLoading(false);

    }
  }

  const logout = async()=>{
    try{
      setError(null);
      setLoading(true);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      router.push('/login');
    }
    catch(error){
      console.error("Logout failed:", error);
    }
  }

  return { login, logout, register, error, loading, message };
}
