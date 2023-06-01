import React from 'react';
import { Navigate, Route } from 'react-router-dom';

const PrivateRoute = ({ path, element }: any) => {
    const isAuthenticated = true; // Replace with your authentication logic

    return isAuthenticated ? (
        <Route path={path} element={element} />
    ) : (
        <Navigate to="/login" replace />
    );
};

export default PrivateRoute;
