import React from 'react';
import Navbar from '../partials/Navbar';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import NavbarNoLogin from '../partials/NavbarNoLogin';

const MainPage = () => {

    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

    return (
        <>
            <div className='full-size flex'>
                {isLoggedIn ? (<Navbar />) : (<NavbarNoLogin />)}
            </div>
        </>
    );
};

export default MainPage;
