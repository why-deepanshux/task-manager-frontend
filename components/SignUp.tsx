"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false); // To handle the loading state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if fields are empty
    if (!email || !password || !username) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await fetch(
        "https://task-manager-backend-dun-two.vercel.app/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      // Handle successful signup
      const data = await response.json();
      console.log(data);
      localStorage.setItem("jwtToken", data.token);
      // Redirect to the dashboard
      router.push("/dashboard");
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="w-[70%] h-[80%] border-2 border-[#161617] rounded-xl">
      <form
        onSubmit={handleSubmit}
        className="w-full h-full flex-col px-4 py-2 flex justify-evenly"
      >
        <div className=" w-[90%] border-2 border-[#7f7f7b] mx-auto rounded-lg py-2 px-4">
          <input
            type="text"
            placeholder="John Doe"
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full focus:outline-none"
          />
        </div>

        <div className=" w-[90%] border-2 border-[#7f7f7b] mx-auto rounded-lg py-2 px-4">
          <input
            type="email"
            placeholder="Johndoe123@gmail.com"
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
            required
            className="w-full focus:outline-none"
          />
        </div>

        <div className="w-[90%] mx-auto text-center">
          <button
            type="submit"
            disabled={loading} // Disable button during loading
            className={`w-full px-4 py-2 rounded ${
              loading
                ? "bg-gray-500 text-gray-200 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
