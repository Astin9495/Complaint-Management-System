
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";


import ProtectedRoute from "./components/ProtectedRoute";
import ComplaintsList from "./pages/complaints/ComplaintsList";
import ComplaintForm from "./pages/complaints/ComplaintForm";
import ComplaintDetail from "./pages/complaints/ComplaintDetail";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* default */}
        <Route path="/" element={<Navigate to="/complaints" replace />} />

        {/* protected */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* complaints */}
        <Route path="/complaints" element={<ProtectedRoute><ComplaintsList /></ProtectedRoute>} />
        <Route path="/complaints/new" element={<ProtectedRoute><ComplaintForm /></ProtectedRoute>} />
        <Route path="/complaints/:id" element={<ProtectedRoute><ComplaintDetail /></ProtectedRoute>} />
        <Route path="/complaints/:id/edit" element={<ProtectedRoute><ComplaintForm /></ProtectedRoute>} />

        
        <Route path="/tasks" element={<Navigate to="/complaints" replace />} />

        
        <Route path="*" element={<Navigate to="/complaints" replace />} />
      </Routes>
    </Router>
  );
}
