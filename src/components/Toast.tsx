"use client";

import { useEffect } from "react";
import {
    XMarkIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
} from "@heroicons/react/24/solid";

type ToastType = "success" | "error" | "warning";

interface ToastProps {
    type: ToastType;
    message: string;
    onClose: () => void;
    duration?: number; // auto-hide after X ms
}

const Toast: React.FC<ToastProps> = ({
    type,
    message,
    onClose,
    duration = 3000,
}) => {
    // Auto-close after duration
    useEffect(() => {
        const timer = setTimeout(() => onClose(), duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const styles = {
        success: {
            icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
            bg: "bg-green-100 dark:bg-green-800",
            text: "dark:text-green-200 text-green-500",
        },
        error: {
            icon: <XCircleIcon className="w-5 h-5 text-red-500" />,
            bg: "bg-red-100 dark:bg-red-800",
            text: "dark:text-red-200 text-red-500",
        },
        warning: {
            icon: (
                <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
            ),
            bg: "bg-orange-100 dark:bg-orange-700",
            text: "dark:text-orange-200 text-orange-500",
        },
    };

    return (
        <div
            className="flex items-center w-full max-w-xs p-4 mb-4 glass rounded-lg shadow-sm text-sm"
            role="alert"
        >
            <div
                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${styles[type].bg}`}
            >
                {styles[type].icon}
            </div>
            <div className="ms-3 font-normal">{message}</div>
            <button
                type="button"
                onClick={onClose}
                className="ms-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 hover:bg-black/20 transition"
                aria-label="Close"
            >
                <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>
        </div>
    );
};

export default Toast;
