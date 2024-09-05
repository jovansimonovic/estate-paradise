import React, { useState } from "react";
import PasswordInput from "../components/PasswordInput";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user, loading, error } = useSelector((state) => state.user);

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="mt-20 flex justify-center text-center">
      <div className="w-[380px]">
        <h2 className="text-3xl font-semibold">Profile</h2>
        <form className="flex flex-col my-8 " onSubmit={handleSubmit}>
          <img
            src={user.avatar}
            alt="profile image"
            className="self-center rounded-full size-32 object-cover cursor-pointer mb-4"
          />
          <input
            type="text"
            placeholder="user.username"
            className="input-box mb-4"
            value={user.username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="input-box mb-4"
            value={user.email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 font-semibold mb-4">{error}</p>}
          <button
            disabled={loading}
            type="submit"
            className="btn-primary disabled:opacity-80 mb-8"
          >
            {loading ? "Loading..." : "Update Profile"}
          </button>
          <div className="grid grid-rows-2 gap-y-2 mb-4">
            <button className="btn-primary">Create Listing</button>
            <button className="btn-secondary">Show All Listings</button>
          </div>
        </form>
        <div className="flex justify-between w-full">
          <button type="button" className="btn-primary">
            {" "}
            Sign Out
          </button>
          <button type="button" className="btn-danger">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
