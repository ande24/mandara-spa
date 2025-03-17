"use client"

import { useEffect } from "react";

const ErrorMessage = ({ onClose, message }) => {

    useEffect(() => {
        setTimeout(() => {
            onClose();
        }, 2000);
    }, [onClose])
    

    return (
        <div role="alert" className="absolute top-4 left-4 rounded-sm border-s-4 border-red-500 bg-red-50 p-4">
            <strong className="block font-medium text-red-800"> Something went wrong </strong>

            <p className="mt-2 text-sm text-red-700">
                {message}
            </p>
        </div>
    )
}

export default ErrorMessage;

