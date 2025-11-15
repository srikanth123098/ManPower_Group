import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App(){
  const [authed, setAuthed] = useState(() => {
    try { return Boolean(localStorage.getItem('token')); }
    catch { return false; }
  });

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={!authed ? <Login setAuthed={setAuthed} /> : <Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={authed ? <Dashboard setAuthed={setAuthed} /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
