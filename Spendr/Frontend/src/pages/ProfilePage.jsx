import React from 'react';
import PersonalInfoForm from '../components/PersonalInfoForm';

const ProfilePage = ({ user, onComplete }) => {
  return (
    <PersonalInfoForm
      user={user}
      onComplete={onComplete}
    />
  );
};

export default ProfilePage;
