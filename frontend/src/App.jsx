import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" exact element={<LogIn />} />
        <Route path="/signup" exact element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" exact element={<Profile />} />
        </Route>
        <Route path="/about" exact element={<About />} />
        <Route path="/create-listing" exact element={<CreateListing />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="bottom-left" />
    </Router>
  );
};

export default App;
