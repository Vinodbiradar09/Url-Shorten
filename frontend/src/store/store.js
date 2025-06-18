import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slice/slice.js";

export const reduxStore =  configureStore({
    reducer : {
      auth : authReducer,
    }
});

export default reduxStore;


