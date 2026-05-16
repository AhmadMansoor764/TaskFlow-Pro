import { useParams } from "react-router-dom";
import { useState } from "react";
import updateImage from "./assets/update.jpg";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const resetPassword = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/reset-password/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      },
    );

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div
      className="h-screen w-full flex flex-col justify-center items-center"
      style={{
        backgroundImage: `url(${updateImage})`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
      }}
    >
      <div className="bg-white p-8 rounded-lg w-[85%] shadow-md flex flex-col gap-4 md:w-[30%]">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Enter New Password
        </h1>
        <input
          className="border-2 border-2-gray-300 rounded-md p-2 mb-4"
          type="password"
          placeholder="New password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-600 p-2 rounded-md text-gray-200 font-semibold"
          onClick={resetPassword}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
