import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import SlotMachine from './pages/SlotMachine';
import AdminPanel from './pages/AdminPanel';
import UserHistory from './pages/UserHistory';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="container mx-auto px-4 pb-20">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><SlotMachine /></PrivateRoute>} />
            <Route path="/history" element={<PrivateRoute><UserHistory /></PrivateRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          </Routes>
        </div>
        <ToastContainer position="bottom-center" autoClose={3000} />
      </AuthProvider>
    </Router>
  );
}

export default App;