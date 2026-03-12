import apiClient from "../axios"

export const getService = async ()=>{
    const res = await apiClient.get("/api/services");
    return res.data.data;
}