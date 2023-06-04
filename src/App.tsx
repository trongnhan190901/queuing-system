import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import MainPage from './components/shared/MainPage';
import ForgotPassword from './components/pages/ForgotPassword';
import ResetPassword from './components/pages/ResetPassword';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from './server/firebase';
import UserInfo from './components/pages/UserInfo';

const App = () => {
    const PrivateRoute = ({ path, element }: any) => {
        const [isLoggedIn, setIsLoggedIn] = useState(false);

        useEffect(() => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                setIsLoggedIn(!!user); // Update isLoggedIn state based on user authentication status
            });

            return () => unsubscribe(); // Unsubscribe from the auth state changes when component unmounts
        }, []);

        return isLoggedIn ? (
            <Route path="/" element={<MainPage />} />
        ) : (
            <Navigate to="/login" replace />
        );
    };

    return (
        <div className="full-size flex">
            <div className="full-size flex">
                <Router>
                    <Routes>
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/" element={<MainPage />} />
                        <Route
                            path="/reset-password"
                            element={<ResetPassword />}
                        />
                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />
                        <Route path="/user" element={<UserInfo />} />

                        <Route element={<PrivateRoute />}>
                            <Route path="/" element={<MainPage />} />
                        </Route>
                    </Routes>
                </Router>
            </div>
        </div>
    );
};

export default App;
