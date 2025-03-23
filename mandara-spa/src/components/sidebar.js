"use client"

import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}></div>}
      
      <div className={`fixed top-0 left-0 w-64 bg-white shadow-lg h-full z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button className="m-4 p-2 bg-red-500 text-white rounded" onClick={() => setIsOpen(false)}>Close</button>
        <nav className="p-4">
          <ul>
            <li className="p-2">Dashboard</li>
            <li className="p-2">Settings</li>
          </ul>
        </nav>
      </div>

      <button className="fixed top-4 left-4 p-2 bg-blue-500 text-white rounded z-50" onClick={() => setIsOpen(!isOpen)}>
        ☰ Menu
      </button>
    </>
  );
}
