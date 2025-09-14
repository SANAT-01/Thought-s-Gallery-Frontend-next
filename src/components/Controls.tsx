"use client";

import { RootState } from "@/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Toast from "./Toast";
import { hideToast } from "@/store/slices/toastSlice";

const Controls = () => {
    const modal = useSelector((state: RootState) => state.modal);
    const toast = useSelector((state: RootState) => state.toast);

    // console.log(modal, toast);

    const dispatch = useDispatch();

    return (
        <div>
            <div className="fixed top-10 right-2 z-[90]">
                {toast.isActive && (
                    <Toast
                        type={toast.type}
                        message={toast.message}
                        onClose={() => dispatch(hideToast())}
                    />
                )}
            </div>
        </div>
    );
};

export default Controls;
