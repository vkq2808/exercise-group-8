import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Footer, HeaderWithSideBar } from '../components/common';
import {
    Login,
    Regist,
    VerifyEmail,
    Logout,
    PasswordResetPage,
    EnterNewPassword,
    NotFound
} from '../pages';

const LoginRoute = () => {
    return (
        <>
            <HeaderWithSideBar />
            <Routes>
                <Route path='login' element={<Login />} />
                <Route path='regist' element={<Regist />} />
                <Route path='verify-email/*' element={<VerifyEmail />} />
                <Route path='logout' element={<Logout />} />
                <Route path='forgot-password' element={<PasswordResetPage />} />
                <Route path='reset-password/*' element={<EnterNewPassword />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
            <Footer />
        </>
    )
};

export default LoginRoute;
