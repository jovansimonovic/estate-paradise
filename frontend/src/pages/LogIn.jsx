import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import { Axios } from "../utils/axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  logInStart,
  logInSuccess,
  logInFailure,
} from "../features/user/userSlice";
import OAuthButton from "../components/OAuthButton";

const LogIn = () => {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(logInStart());

    if (!email || !password) {
      dispatch(logInFailure("Both fields are required"));
      return;
    }

    try {
      const formData = { email, password };
      const response = await Axios.post("/auth/login", formData);

      if (response.data.success === true) {
        dispatch(logInSuccess(response.data.user));
        localStorage.setItem("token", response.data.token);
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      dispatch(logInFailure(error.response.data.message));
    }
  };

  return (
    <div className="mt-36 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-semibold">Log In</h1>
      <form className="flex flex-col mt-8 w-[380px]" onSubmit={handleSubmit}>
        <input
          type="email"
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
          <OAuthButton />
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
