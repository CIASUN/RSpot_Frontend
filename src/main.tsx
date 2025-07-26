import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminPlacesPage from './pages/AdminLayout';
import UnauthorizedPage from './pages/UnauthorizedPage';

import PrivateRoute from './components/PrivateRoute';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Приватные маршруты для User */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<UserDashboardPage />} />
        </Route>

        {/* Приватные маршруты только для Admin */}
        <Route element={<PrivateRoute requiredRole="Admin" />}>
          <Route path="/admin/places" element={<AdminPlacesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
