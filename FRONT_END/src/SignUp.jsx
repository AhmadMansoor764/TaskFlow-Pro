import React, { useState } from "react";
import loginimage from "./assets/loginmaterial.png";
import { Link, useNavigate } from "react-router-dom";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";

const SignUp = () => {
  const [passwordType, setPasswordType] = useState("password");
  const navigate = useNavigate();

  const showPassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const getInfo = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("name"),
    };

    if (!data.email || !data.name || !data.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message);
        return;
      }

      console.log(result);

      alert("User created successfully");
      navigate("/dashboard");
      e.target.reset();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="h-screen w-full p-10 bg-[#efefef]">
      <div className="md:grid md:grid-cols-2 h-full">
        <div className="flex flex-col gap-10 justify-center items-center ">
          <h1 className="text-3xl font-semibold">Create an Account</h1>
          <form
            onSubmit={getInfo}
            className="bg-white  w-6/7 h-[75%] p-6 rounded-2xl flex flex-col gap-5 lg:w-5/7"
          >
            <div className="flex flex-col gap-2">
              <label className="font-semibold" htmlFor="name">
                Name
              </label>
              <input
                name="name"
                type="text"
                className="border-2 px-2 border-gray-400 rounded-2xl py-2 "
                placeholder="Name"
              />
            </div>

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
            </div>

            <button
              type="submit"
              className="p-3 rounded-2xl bg-blue-600 mt-12 font-semibold text-[1.2rem]"
            >
              sign up
            </button>
            <p className="text-center mt-3 text-[1.1rem]">
              Already a memeber{" "}
              <Link
                className="text-[1.2rem] text-blue-600 font-semibold"
                to="/login"
              >
                Sign in
              </Link>{" "}
            </p>
          </form>
        </div>
        <div className="hidden md:flex">
          <img
            className="object-contain"
            src={loginimage}
            alt="login image notebook and pen"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
