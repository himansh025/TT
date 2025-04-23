import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: JSON.parse(sessionStorage.getItem("user")) || null,
  token: sessionStorage.getItem("token") || null,
};


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login:(state,action)=>{
            
            const { user,token  } = action.payload;
            state.status = true,
            state.user = user
            sessionStorage.setItem("user", JSON.stringify(user));
            sessionStorage.setItem("token", token);
        },
        logout: (state) => {
            state.status = false;
            state.user = null;
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");
        }
        
    },
})
export const { login, logout } = authSlice.actions
export default authSlice.reducer