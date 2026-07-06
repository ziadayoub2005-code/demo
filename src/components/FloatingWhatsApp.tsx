"use client";

import React from "react";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/966500000000"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:bg-[#1ebd5a] transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center"
      aria-label="Contact us on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M11.99 2C6.47 2 2 6.48 2 12c0 1.75.46 3.4 1.25 4.86L2 22l5.32-1.19C8.6 21.54 10.25 22 11.99 22c5.52 0 10-4.48 10-10S17.51 2 11.99 2zm5.77 14.59c-.27.76-1.53 1.46-2.12 1.54-.5.06-1.14.12-3.32-.78-2.62-1.09-4.31-3.79-4.44-3.96-.13-.17-1.06-1.41-1.06-2.69 0-1.28.66-1.92.89-2.17.23-.25.5-.31.66-.31.17 0 .34 0 .48.01.15.01.35-.06.54.41.2.48.68 1.66.74 1.79.06.12.1.27.02.44-.08.17-.12.27-.24.41-.12.15-.26.33-.37.44-.13.13-.27.27-.12.53.15.26.68 1.13 1.46 1.83.99.9 1.84 1.18 2.1 1.3.26.13.41.1.57-.08.15-.2.66-.76.84-1.03.18-.26.36-.22.6-.13.24.08 1.51.71 1.77.84.26.13.43.2.49.31.07.11.07.64-.2 1.4z" />
      </svg>
    </a>
  );
}
