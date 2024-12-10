import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaRegEyeSlash } from 'react-icons/fa';
import { IoIosEye } from 'react-icons/io';
const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastMessage, setToastMessage] = useState(""); // State for toast message
  const [showToast, setShowToast] = useState(false); // For controlling toast visibility

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form reload
    if (!email || !password) {
      displayToast("All fields are required!");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      displayToast("Login successful!");
      setTimeout(() => navigate("/chats"), 3000); // Navigate after 3 seconds
    } catch (error) {
      displayToast("Login failed! Please try again.");
    }
  };

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <>
      <form className="flex flex-col  gap-3" onSubmit={handleSubmit}>
        {showToast && (
          <div className="toast toast-top toast-end z-50">
            <div className="alert alert-error">
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        <label className="input input-bordered  flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="email"
            value={email}
            className="grow"
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </label>

        <label className="input input-bordered  flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type={show ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="grow bg-transparent"
            value={password}
            placeholder="Password"
          />
          <div
            className="sm:p-2 rounded text-teal-500"
            onClick={() => setShow(!show)}
          >
   {/* {show ? (
    <>
      
      <span className="sm:hidden">
        <FaRegEyeSlash />
      </span>
      <span className="hidden sm:inline">
        <FaRegEyeSlash /> Hide
      </span>
    </>
  ): (
    <>
      <span className="sm:hidden">
        <IoIosEye />
      </span>
      <span className="hidden sm:inline">
        <IoIosEye /> Show
      </span>
    </>
  )} */}
            </div>
        </label>

        <button className="p-2 rounded text-white " type="submit">
          Login
        </button>
        <button
          className="p-2 rounded  text-white "
          onClick={() => {
            setEmail("guest@example.com");
            setPassword("guest123");
          }}
        >
          Get guest user credentials
        </button>
        <p className="text-center">
          Not Registered?{" "}
          <span className="underline hover:text-teal-500" onClick={() => navigate("/signup")}>
            Signup
          </span>
        </p>
      </form>
    </>
  );
};

export default Login;
