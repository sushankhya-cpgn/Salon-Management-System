import {apiClient} from "./axios";

// export type UserResponse = {
//     email: string;
//     name: string;
// }


export const getUser = async (userId: number) => {
    const res = await apiClient.get('/api/user', {
        params: { userId }
    });
    return res.data.data;
}
