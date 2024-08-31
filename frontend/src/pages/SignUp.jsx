import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../utils/axios";
import PasswordInput from "../components/PasswordInput";
import { toast } from "react-toastify";
import OAuthButton from "../components/OAuthButton";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (username.length < 3 || username.length > 20) {
      setError("Username must be between 3 and 20 characters");
      setLoading(false);
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Invalid email address");
      setLoading(false);
      return;
    }

    if (password.length < 8 || password.length > 20) {
      setError("Password must be between 8 and 20 characters");
      setLoading(false);
      return;
    }

    try {
      const formData = { username, email, password };
      const response = await Axios.post("/auth/signup", formData);

      if (response.data.success === false) {
        setError(response.data.message);
        setLoading(false);
        return;
      }

      if (response.data.success === true) {
        toast.success(response.data.message);
        setError(null);
        setLoading(false);
        navigate("/login");
      }
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="mt-36 flex flex-col justify-center items-center">
      <h2 className="text-3xl font-semibold">Sign Up</h2>
      <form className="flex flex-col mt-8 w-[380px]" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="input-box mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="input-box mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            {loading ? "Loading..." : "Sign Up"}
          </button>
          <OAuthButton />
        </div>
      </form>
      <div className="mt-4 text-lg">
        Already have an account?{" "}
        <Link to={"/login"} className="text-blue-500 font-semibold">
          Log In
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
