import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user : null,
    isAuthenticated : false,
}

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
        login : (state , action) =>{
            state.user = action.payload;
            // if(state.user === undefined){
            //     throw new Error("Failed becoz you are not logged In");
            // }
            state.isAuthenticated = true;
        },
        logout : (state ) =>{
            state.user = null;
            state.isAuthenticated = false;
        }
    }
});

export const {login , logout} = authSlice.actions;
export default authSlice.reducer;