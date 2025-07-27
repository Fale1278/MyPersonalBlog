import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Register/Register';
import Dashboard from '../pages/Dashboard/Dashboard';
import Write from '../pages/Write/Write';
import Post from '../pages/Post/Post';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/write" element={<Write />} />
      <Route path="/post/:id" element={<Post />} />
    </Routes>
  );
};

export default AppRoutes;
