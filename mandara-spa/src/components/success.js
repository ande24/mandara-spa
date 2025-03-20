"use client"

import { useEffect, useState } from "react";

const SuccessMessage = ({ onClose, message }) => {

    useEffect(() => {
        setTimeout(() => {
            onClose();
        }, 5000);
    })
    

    return (
        <div role="alert" className={`z-100 absolute top-4 left-4 rounded-sm border-s-4 border-green-500 bg-green-50 p-4 -scale-z-100 `}>
            <strong className="block font-medium text-green-800"> Good to go </strong>

            <p className="mt-2 text-sm text-green-700">
                {message}
            </p>
        </div>
    )
}

export default SuccessMessage;

