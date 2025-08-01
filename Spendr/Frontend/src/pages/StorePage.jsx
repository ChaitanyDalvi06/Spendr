import React from 'react';
import Store from '../components/Store';

const StorePage = ({ user, onPurchase }) => {
  return <Store user={user} onPurchase={onPurchase} />;
};

export default StorePage;
