import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastMessage, setToastMessage] = useState(""); // State for toast message
  const [showToast, setShowToast] = useState(false); // For controlling toast visibility

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form reload
    if (!name || !email || !password) {
      displayToast("All fields are required!");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post("/api/user/", { name, email, password }, config);

      localStorage.setItem("userInfo", JSON.stringify(data));
      displayToast("Signup successful");
      setTimeout(() => navigate("/chats"), 3000); // Navigate after 3 seconds
    } catch (e) {
      displayToast("Signup failed! Please try again.");
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
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        {showToast && (
          <div className="toast toast-top toast-end z-50">
            <div className="alert alert-error">
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        <label className="input input-bordered flex items-center gap-2">
          <input
            type="email"
            className="grow"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            required
            className="grow"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Username"
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <input
            type={show ? "text" : "password"}
            className="grow"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <div
            className="text-teal-500 p-2 rounded"
            onClick={() => setShow(!show)}
          >
            {show ? "Hide" : "Show"}
          </div>
        </label>

        <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between">
          <p className="text-center">
            Already have an account? <a href="/" className="underline hover:text-teal-500">Login</a>
          </p>
          <button className="btn bg-teal-500 hover:bg-teal-600 text-white" type="submit">
            Signup
          </button>
        </div>
      </form>
    </>
  );
};

export default Signup;
