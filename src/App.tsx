import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import MainPage from './components/shared/MainPage';
import ForgotPassword from './components/pages/ForgotPassword';
import ResetPassword from './components/pages/ResetPassword';
import UserInfo from './components/pages/UserInfo';
import AddDevice from './components/shared/device/AddDevice';
import { Toaster } from 'react-hot-toast';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from 'store/store';
import DevicePage from './components/pages/device/[params]';
import DeviceContainer from './components/shared/device/DeviceContainer';
import ServiceContainer from './components/shared/service/ServiceContainer';
import NumberContainer from './components/shared/number/NumberContainer';
import ReportContainer from './components/shared/report/ReportContainer';
import RoleContainer from './components/shared/system/role/RoleContainer';
import AccountContainer from './components/shared/system/account/AccountContainer';
import LogContainer from './components/shared/system/log/LogContainer';

const AppContent = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const navigate = useNavigate();

    React.useEffect(() => {
        const currentPath = window.location.pathname;
        if (!user && currentPath !== '/login' && currentPath !== '/reset-password' && currentPath !== '/forgot-password' && currentPath !== '/') {
            navigate('/login');
        }
    }, [user, navigate]);

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
                <Route
                    path='/devices'
                    element={<DeviceContainer />}
                />
                <Route
                    path='/services'
                    element={<ServiceContainer />}
                />
                <Route
                    path='/numbers'
                    element={<NumberContainer />}
                />
                <Route
                    path='/reports'
                    element={<ReportContainer />}
                /> <Route
                path='/roles'
                element={<RoleContainer />}
            />
                <Route
                    path='/accounts'
                    element={<AccountContainer />}
                />
                <Route
                    path='/logs'
                    element={<LogContainer />}
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
