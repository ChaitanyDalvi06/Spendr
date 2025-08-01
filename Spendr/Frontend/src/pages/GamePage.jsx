import React from 'react';
import Game from '../components/Game';

const GamePage = ({ onCompleteScenario, user }) => {
  return <Game onCompleteScenario={onCompleteScenario} user={user} />;
};

export default GamePage;
