import apiClient from "./axios"

export const createAppointment = async(data:any) => {
    const res = await apiClient.post("/api/appointment",data);
    console.log(res)
    return res
}