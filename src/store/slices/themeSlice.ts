// store/slices/themeSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface ThemeState {
    mode: "dark" | "light";
}

const initialState: ThemeState = {
    mode: "dark", // default
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === "dark" ? "light" : "dark";
            localStorage.setItem("theme", state.mode);
        },
        loadTheme: (state) => {
            const stored = localStorage.getItem("theme");
            if (stored === "dark" || stored === "light") {
                state.mode = stored;
            }
        },
    },
});

export const { toggleTheme, loadTheme } = themeSlice.actions;
export default themeSlice.reducer;
