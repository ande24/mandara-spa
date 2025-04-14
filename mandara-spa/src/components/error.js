"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const ErrorMessage = ({ onClose, message }) => {
    useEffect(() => {
        setTimeout(() => {
            onClose();
        }, 5000);
    })

    return (
        <div 
            role="alert" 
            className="z-100 absolute top-4 left-4 rounded-sm border-s-4 border-red-500 bg-red-50 p-4 shadow-md flex items-start"
        >
            <div>
                <strong className="block font-medium text-red-800">Something went wrong</strong>
                <p className="mt-2 text-sm text-red-700">{message}</p>
            </div>
        </div>
    );
};

export default ErrorMessage;