import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminLayout from './pages/AdminLayout';
import PlacesPage from './pages/PlacesPage';
import PrivateRoute from './components/PrivateRoute';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<PrivateRoute />}>
			<Route element={<AdminLayout />}>
			  <Route path="places" element={<PlacesPage />} />
			</Route>
		  </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
