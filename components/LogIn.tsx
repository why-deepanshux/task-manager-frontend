"use client"
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const LogIn=()=>{
    const [email,setEmail]=useState("");
    const [password , setPassword]=useState("");
    const [loading , setLoading]=useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      // Simple validation to check if fields are empty
      if (!email || !password) {
        alert("Please fill in all fields.");
        return;
      }

      // Making the POST request to the backend
      
      try {
        setLoading(true);
        const response = await fetch(
          "https://task-manager-backend-dun-two.vercel.app/api/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Login failed");
          setLoading(false);
        }

        // Handle successful login (e.g., redirect, store token)
        const data = await response.json();

        console.log(data);
         // You can store the token or redirect to another page
         localStorage.setItem("jwtToken", data.token);
        router.push("/dashboard");
        } catch (error) {
        alert("An error occurred. Please try again.");
        setLoading(false);
      }
      setLoading(false);
    };
    return (
      <div className="w-[70%] h-[80%] border-2 border-[#161617] rounded-xl">
        <form
          onSubmit={handleSubmit}
          className="w-full h-full flex-col px-4 py-2 flex justify-evenly "
        >
          <div className=" w-[90%] border-2 border-[#7f7f7b] mx-auto rounded-lg py-2 px-4">
            <input
              type="email"
              placeholder="Johndoe123@gnail.com"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full focus:outline-none"
            />
          </div>

          <div className=" w-[90%] border-2 border-[#7f7f7b] mx-auto rounded-lg py-2 px-4">
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full focus:outline-none"
            />
          </div>

          <div className="w-[90%] mx-auto text-center">
            <button
              type="submit"
              className="w-full bg-black text-white px-4 py-2 rounded"
            >
              {loading ? "Logging In" : "Log In"}
            </button>
          </div>
        </form>
      </div>
    );
}

export default LogIn;
