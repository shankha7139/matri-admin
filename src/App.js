import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login";
import { AuthProvider } from "./AuthContext";
import Report from "./pages/Report";
import Agents from "./pages/Agents";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/reportedusers" element={<Report />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
