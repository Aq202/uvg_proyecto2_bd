import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from '../LoginPage';
import SignUpPage from '../SignUpPage/SignUpPage';

function UnloggedIndexPage() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default UnloggedIndexPage;
