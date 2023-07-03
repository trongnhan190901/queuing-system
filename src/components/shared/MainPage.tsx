import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import NavbarNoLogin from '../partials/NavbarNoLogin';
import DashboardContainer from './dashboard/DashboardContainer';

const MainPage = () => {

    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

    return (
        <>
            <div className='full-size flex'>
                {isLoggedIn ? (<DashboardContainer />) : (<NavbarNoLogin />)}
            </div>
        </>
    );
};

export default MainPage;
