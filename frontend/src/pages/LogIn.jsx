import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import Axios from "../utils/axios";
import { toast } from "react-toastify";

const LogIn = () => {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const formData = { email, password };
      const response = await Axios.post("/auth/login", formData);

      if (response.data.success === false) {
        setError(response.data.message);
        setLoading(false);
        return;
      }

      if (response.data.success === true) {
        localStorage.setItem("token", response.data.token);
        toast.success(response.data.message);
        setError(null);
        setLoading(false);
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="mt-36 flex flex-col justify-center items-center">
      <h2 className="text-3xl font-semibold">Log In</h2>
      <form className="flex flex-col mt-8 w-[380px]" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          className="input-box mb-4"
          value={email}
          onChange={(e) => setUsername(e.target.value)}
        />
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 font-semibold mb-4">{error}</p>}
        <div className="grid grid-flow-col gap-x-4">
          <button
            disabled={loading}
            type="submit"
            className="btn-primary disabled:opacity-80"
          >
            {loading ? "Loading..." : "Log In"}
          </button>
          <button
            aria-label="Sign in with Google"
            className="btn-primary flex items-center p-0.5"
          >
            <div className="flex items-center justify-center bg-white w-9 h-9 rounded-l">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <title>Sign in with Google</title>
                <desc>Google G Logo</desc>
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  className="fill-google-logo-blue"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  className="fill-google-logo-green"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  className="fill-google-logo-yellow"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  className="fill-google-logo-red"
                ></path>
              </svg>
            </div>
            <span className="flex-1 text-md font-semibold text-white">
              Continue with Google
            </span>
          </button>
        </div>
      </form>
      <div className="mt-4 text-lg">
        Don't have an account?{" "}
        <Link to={"/signup"} className="text-blue-500 font-semibold">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LogIn;
