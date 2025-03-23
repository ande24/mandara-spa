"use client"

import { useState, useRef, useEffect } from "react";
import { createPopper } from "@popperjs/core";

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isOpen && buttonRef.current && menuRef.current) {
      createPopper(buttonRef.current, menuRef.current, {
        placement: "bottom-end",
        modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
      });
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button ref={buttonRef} onClick={() => setIsOpen(!isOpen)} className="px-4 py-2 bg-gray-500 text-white rounded">
        Open Dropdown
      </button>
      {isOpen && (
        <div ref={menuRef} className="absolute mt-2 w-40 bg-white shadow-md rounded p-2">
          <p className="p-2 hover:bg-gray-100 cursor-pointer">Option 1</p>
          <p className="p-2 hover:bg-gray-100 cursor-pointer">Option 2</p>
        </div>
      )}
    </div>
  );
}
