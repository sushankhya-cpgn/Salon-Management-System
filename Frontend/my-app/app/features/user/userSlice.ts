import apiClient from '@/lib/api/axios';
import { getUser } from '@/lib/api/user';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
    email: string;
    name: string;

}

export const fetchUser = createAsyncThunk('user/fetchUser', async (userId:number) => {
    const res = await getUser(Number(userId));
    console.log(res )
    return res;
})


const initialState: UserState = {
    email: "",
    name: ""
};


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            state.email = action.payload.email;
            state.name = action.payload.name;
        },
        clearUser: (state) => {
            state.email = "";
            state.name = "";
        }
    },

    extraReducers: (builder) => {
        // Handle async actions like login, register, etc. here if needed   
        builder.addCase(fetchUser.pending, (state) => {
            state.email = "";
            state.name = "";
        })
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.email = action.payload.email;
            state.name = action.payload.name;
        })

        builder.addCase(fetchUser.rejected, (state) => {
            state.email = "";
            state.name = "";
        })
    }

});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
