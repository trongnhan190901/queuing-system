import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import MainPage from './components/shared/MainPage';
import ForgotPassword from './components/pages/ForgotPassword';
import ResetPassword from './components/pages/ResetPassword';
import UserInfo from './components/pages/UserInfo';
import AddDevice from './components/shared/device/AddDevice';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import store from 'store/store';
import DevicePage from './components/pages/device/[params]';

const AppContent = () => {
    const location = useLocation();

    return (
        <div className='full-size flex'>
            <Toaster
                position='top-center'
                reverseOrder={false}
                toastOptions={{
                    style: {
                        fontSize: '14px',
                    },
                }}
            />
            <Routes>

                <Route
                    path='/login'
                    element={<LoginPage />}
                />
                <Route
                    path='/'
                    element={<MainPage />}
                />
                <Route
                    path='/reset-password'
                    element={<ResetPassword />}
                />
                <Route
                    path='/forgot-password'
                    element={<ForgotPassword />}
                />
                <Route
                    path='/user'
                    element={<UserInfo />}
                />
                <Route
                    path='/add-device'
                    element={<AddDevice />}
                />

                <Route
                    path={`/device/:params`}
                    element={<DevicePage />}
                />
            </Routes>
        </div>
    );
};

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <AppContent />
            </Router>
        </Provider>
    );
};

export default App;
