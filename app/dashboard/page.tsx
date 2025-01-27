"use client"
import { useState } from "react";
import Button from "@/components/Button";
import Tasklist from "@/components/Tasklist";
import DashboardStats from "@/components/Dashboard";
import { useRouter } from "next/navigation";
const Dashboard = () => {
    const router=useRouter();
    const handleSignOut = () =>{
      const token = localStorage.getItem("jwtToken");

      if(!token){
        alert("Not LoggedIn");
      }

      localStorage.removeItem("jwtToken");
      router.back();
      return;
    }
    const [dash , setDash]=useState(false);
    const [taskbar , setTaskbar]=useState(true);
    const dashClick = () =>{
        setDash(true);
        setTaskbar(false);
    }
    const taskbarClick = () =>{
        setDash(false);
        setTaskbar(true);
    }
  return (
    <div className="w-full mt-2">
      <div className="w-[90%] mx-auto flex flex-row justify-between ">
        <div className="text-[1rem] flex flex-row gap-4 h-[2.5rem]">
          <Button title={"Dashboard"} black={dash ? true:false} onClick={dashClick} />
          <Button title={"Taskbar"} black={taskbar ? true:false} onClick={taskbarClick} />
        </div>

        <div>
            <button className="h-[2.5rem] bg-black text-white px-8 py-1 text-center rounded-3xl" onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>

      <div className="w-[90%] mx-auto">
        {dash ? <DashboardStats /> : <Tasklist />}
      </div>

    </div>
  );
};

export default Dashboard;
