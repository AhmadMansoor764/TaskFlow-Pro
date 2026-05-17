import React, { useState } from "react";
import loginimage from "./assets/loginmaterial.png";
import { Link } from "react-router-dom";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState("password");
  const [error, setError] = useState("");

  const showPassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const getInfo = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    if (!data.email || !data.password) {
      setError("Please fill all fields");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message);
        setTimeout(() => {
          setError("");
        }, 3000);
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }

    e.target.reset();
    setPasswordType("password");
  };

  return (
    <div className="h-screen w-full p-10 bg-[#efefef]">
      <div className="md:grid md:grid-cols-2 h-full">
        <div className="flex flex-col gap-10 justify-center items-center ">
          <h1 className="text-3xl font-semibold">Login to Your Account</h1>
          <form
            onSubmit={getInfo}
            className="bg-white  w-[90%] h-full p-6 rounded-2xl flex flex-col gap-5 shadow-md lg:w-5/7 md:h-[50%]"
          >
            <div className="flex flex-col gap-2">
              <label className="font-semibold" htmlFor="email">
                Email
              </label>
              <input
                name="email"
                type="email"
                className="border-2 px-2 border-gray-400 rounded-2xl py-2 "
                placeholder="Email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold" htmlFor="password">
                Password
              </label>
              <div className="border-2 border-gray-400 rounded-2xl px-2 flex  items-center">
                <input
                  name="password"
                  className="w-full p-2 border-none outline-none"
                  type={passwordType}
                  placeholder="Password"
                />
                {passwordType === "text" ? (
                  <IoEye size={25} onClick={showPassword} />
                ) : (
                  <IoMdEyeOff size={25} onClick={showPassword} />
                )}
              </div>
              <p className="text-end">
                <Link to="/forgot-password">Forgot Password?</Link>
              </p>
            </div>

            <button
              type="submit"
              className="p-3 rounded-2xl bg-blue-600 font-semibold text-[1.2rem]"
            >
              Login
            </button>
            <div className="flex flex-col ">
              <p className="text-center mt-3 text-[1.1rem]">
                Don't have an account?{" "}
                <Link
                  className="text-[1.2rem] text-blue-600 font-semibold"
                  to="/signup"
                >
                  Sign Up
                </Link>{" "}
              </p>
              <p className="text-center text-red-600 font-semibold">{error}</p>
            </div>
          </form>
        </div>
        <div className="hidden md:flex">
          <img className="object-contain" src={loginimage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Login;
