import React from "react";
import { Routes, Route } from "react-router-dom";
import Welcome from "./Welcome";
import Login from "./Login";
import MainLayout from "./MainLayout";
import Dashboard from "./Dashboard";
import Tasks from "./Tasks";
import Plan from "./Plan";
import SignUp from "./SignUp";
import PlanDetails from "./PlanDetails";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

const App = () => {
  return (
    <Routes>
      {/* Welcome page WITHOUT sidebar */}
      <Route path="/" element={<Welcome />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      {/* Pages WITH sidebar */}
      <Route element={<MainLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="plans" element={<Plan />} />
        <Route path="/plans/:id" element={<PlanDetails />} />
      </Route>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
};

export default App;
