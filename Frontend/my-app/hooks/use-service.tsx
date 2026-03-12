import { getService } from '@/lib/api/service/service'
import React, { useEffect, useState } from 'react'

export default  function useService() {
    const [services,setServices] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);

    const fetchService = async () => {
        try{
            setLoading(true);
            const res = await getService();
            console.log(res)
            setServices(res);
        }
        catch(error:any){
            setError(error)
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchService();
    },[])

    return {services,loading,error,fetchService}
}


