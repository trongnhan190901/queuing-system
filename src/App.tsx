import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import MainPage from './components/shared/MainPage';
import { useState } from 'react';
import ForgotPassword from './components/pages/ForgotPassword';
import ResetPassword from './components/pages/ResetPassword';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from './hook/PrivateRoute';

const App = () => {
    return (
        <div className="full-size flex">
            <div className="full-size flex">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<MainPage />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
