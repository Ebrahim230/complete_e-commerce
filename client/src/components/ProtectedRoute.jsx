import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { token } = useContext(ShopContext);
    if (!token) {
        return <Navigate to='/login' replace />
    }
    return children;
}

export default ProtectedRoute;