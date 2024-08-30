import React from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { useSelector } from "react-redux";

const Header = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto p-3">
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap hover:drop-shadow-lg">
          <Link to="/">
            <span className="text-slate-500">Estate</span>
            <span className="text-slate-700">Paradise</span>
          </Link>
        </h1>
        <div className="bg-slate-100 flex items-center p-2 rounded text-md font-semibold outline-none">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none w-28 sm:w-64"
          />
          <FaSearch className="text-slate-600 cursor-pointer" size={18} />
        </div>
        <ul className="flex gap-x-3 font-semibold text-slate-700">
          <li className="hidden sm:block hover:text-slate-500">
            <Link to="/">Home</Link>
          </li>
          <li className="hidden sm:block hover:text-slate-500">
            <Link to="/about">About</Link>
          </li>
          {user ? (
            <>
              <li className="hover:text-slate-500">
                <Link to="/login">
                  <CgProfile size={30} />
                </Link>
              </li>
            </>
          ) : (
            <li className="hover:text-slate-500">
              <Link to="/login">Log In</Link>
            </li>
          )}
        </ul>
      </div>
    </header>
    // todo: decide on a UI library and install
  );
};

export default Header;
