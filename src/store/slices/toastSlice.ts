import { createSlice } from "@reduxjs/toolkit";

interface ToastState {
    type: "success" | "error" | "warning";
    message: string;
    isActive: boolean;
}

const initialState: ToastState = {
    type: "success",
    message: "Signed in successfully!",
    isActive: false,
};

const toastSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
        showToast: (state, action) => {
            state.type = action.payload.type;
            state.message = action.payload.message;
            state.isActive = true;
        },
        hideToast: (state) => {
            state.isActive = false;
        },
    },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
