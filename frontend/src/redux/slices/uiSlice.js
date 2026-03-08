import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name: "ui",
    initialState: {
        authModalOpen: false,// tells if auth modal is open or not
        authMode : "login", // tells whether the auth modal is in 'login' or 'register' mode
    },
    reducers: {
        openAuthModal: (state, action) => {
            state.authModalOpen = true;
            state.authMode = action.payload || "login"; // 'login' or 'register'
        },
        closeAuthModal: (state,action) => {
            state.authModalOpen = false;
            state.authMode = "login";
        },
        switchAuthMode: (state, action) => {
            state.authMode = action.payload; // 'login' or 'register'
        },
    },
});
export const { openAuthModal, closeAuthModal, switchAuthMode } = uiSlice.actions;

export default uiSlice.reducer; 