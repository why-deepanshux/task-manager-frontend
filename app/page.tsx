"use client";
import Image from "next/image";
import Button from "@/components/Button";
import { useState } from "react";
import LogIn from "@/components/LogIn";
import SignUp from "@/components/SignUp";
export default function Home() {
  const [logState, setLogState] = useState(false);
  const [signupState, setSignupState] = useState(false);

  const loginClicked = () => {
    setLogState(true);
    setSignupState(false);
  };

  const signupClicked = () => {
    setSignupState(true);
    setLogState(false);
  };

  return (
    <div className="w-full h-[70vh]">
      <div className="w-[90%] flex flex-row mt-6 mx-auto h-full">
        <div className="w-[50%] p-2 flex-col text-5xl font-[700] my-auto">
          <div>Stay Organized,</div>
          <div>Achieve More</div>
          <div className="text-lg font-[400] mt-2">
            {" "}
            - Manage Your Tasks With Flow
          </div>
          <div className="text-[1rem] flex gap-4 mt-4">
            <Button title="Sign Up" black={true} onClick={signupClicked} />
            <Button title="Log In" black={false} onClick={loginClicked} />
          </div>
        </div>
        <div className="w-[50%] flex justify-center items-center relative">
          {logState === false && signupState === false ? (
            <Image
              src="/assets/Images/home.svg"
              alt="Landing Page Image"
              width={600}
              height={500}
              className="w-[90%] mx-auto object-contain"
            />
          ) : logState === true ? (
            // login component
            <LogIn />
          ) : (
            // signup component
            <SignUp />
          )}
        </div>
      </div>
    </div>
  );
}
