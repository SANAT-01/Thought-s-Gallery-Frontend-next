"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useEffect } from "react";
import { loadUserFromStorage } from "@/store/slices/authSlice";
import { loadTheme } from "@/store/slices/themeSlice";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        store.dispatch(loadUserFromStorage());
        store.dispatch(loadTheme());
    }, []);
    return <Provider store={store}>{children}</Provider>;
};
