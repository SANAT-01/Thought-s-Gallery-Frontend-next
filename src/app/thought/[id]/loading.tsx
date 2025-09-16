import LoaderSpinner from "@/components/SpinnerComponent";
import React from "react";

const loading = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <LoaderSpinner />
        </div>
    );
};

export default loading;
