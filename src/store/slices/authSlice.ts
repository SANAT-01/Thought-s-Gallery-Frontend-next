// store/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: string;
    username: string;
    email: string;
}

interface AuthState {
    isLoggedIn: boolean;
    token: string | null;
    user: User | null;
}

const initialState: AuthState = {
    isLoggedIn: false,
    token: null,
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (
            state,
            action: PayloadAction<{ token: string; user: User }>
        ) => {
            state.isLoggedIn = true;
            state.token = action.payload.token;
            state.user = action.payload.user;

            // persist in localStorage
            localStorage.setItem("authToken", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.token = null;
            state.user = null;

            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
        },
        loadUserFromStorage: (state) => {
            const token = localStorage.getItem("authToken");
            const user = localStorage.getItem("user");
            if (token && user) {
                state.isLoggedIn = true;
                state.token = token;
                state.user = JSON.parse(user);
            }
        },
    },
});

export const { login, logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
