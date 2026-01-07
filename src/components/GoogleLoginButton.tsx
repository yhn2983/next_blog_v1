"use client";

import React from "react";
import { signIn } from "next-auth/react";

interface GoogleButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  text?: string;
}

export default function GoogleLoginButton({
  onClick,
  disabled = false,
  text = "Sign in with Google",
}: GoogleButtonProps) {
  const onClickHandler = () => signIn("google", { callbackUrl: "/" });
  return (
    <button
      onClick={onClickHandler}
      disabled={disabled}
      className=" w-full mt-6
        group relative flex h-10 w-auto min-w-max max-w-[400px] items-center justify-between 
        overflow-hidden rounded-[20px] border border-[#8e918f] bg-[#131314] px-3 
        text-center font-['Roboto',_arial,_sans-serif] text-sm tracking-[0.25px] text-[#e3e3e3] 
        transition-all duration-200 ease-in-out
        hover:shadow-[0_1px_2px_0_rgba(60,64,67,0.30),0_1px_3px_1px_rgba(60,64,67,0.15)]
        disabled:cursor-default disabled:bg-[#13131461] disabled:border-[#8e918f1f]
      "
    >
      {/* State Overlay (Hover/Focus effect) */}
      <div
        className="
        absolute inset-0 opacity-0 transition-opacity duration-200
        group-hover:bg-white group-hover:opacity-[8%]
        group-active:bg-white group-active:opacity-[12%]
        group-focus:bg-white group-focus:opacity-[12%]
        disabled:group-hover:opacity-0
      "
      />

      <div className="relative flex w-full items-center justify-between pointer-events-none">
        {/* Google Icon */}
        <div className="mr-[10px] h-5 w-5 min-w-[20px] shrink-0 disabled:opacity-[38%]">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="block w-full h-full"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            ></path>
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            ></path>
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            ></path>
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            ></path>
          </svg>
        </div>

        {/* Text */}
        <span className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap font-medium disabled:opacity-[38%]">
          {text}
        </span>
      </div>
    </button>
  );
}
