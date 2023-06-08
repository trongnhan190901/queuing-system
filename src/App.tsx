import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from 'react-router-dom';
import { auth } from './server/firebase';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import MainPage from './components/shared/MainPage';
import ForgotPassword from './components/pages/ForgotPassword';
import ResetPassword from './components/pages/ResetPassword';
import UserInfo from './components/pages/UserInfo';
import AddDevice from './components/shared/device/AddDevice';
import { Toaster } from 'react-hot-toast';

const AppContent = () => {
    const PrivateRoute = ({ path, element }: any) => {
        const [isLoggedIn, setIsLoggedIn] = useState(false);

        useEffect(() => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                setIsLoggedIn(!!user); // Update isLoggedIn state based on user authentication status
            });

            return () => unsubscribe(); // Unsubscribe from the auth state changes when component unmounts
        }, []);

        return isLoggedIn ? (
            <Route path={path} element={element} />
        ) : (
            <Navigate to="/login" replace />
        );
    };

    return (
        <div className="full-size flex">
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<MainPage />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/user" element={<UserInfo />} />
                <Route path="/add-device" element={<AddDevice />} />

                <Route
                    element={<PrivateRoute path="/" element={<MainPage />} />}
                />
            </Routes>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
