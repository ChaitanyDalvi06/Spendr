import React from 'react';
import Auth from '../components/Auth';

const AuthPage = ({ onLogin }) => {
  return <Auth onLogin={onLogin} />;
};

export default AuthPage;
