import React from 'react';
import { Route, Routes } from 'react-router-dom';
import InputScreen from '../components/InputScreen';
import ChatScreen from '../components/ChatScreen';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path='/' element={<InputScreen />} />
        <Route path='/chat' element={<ChatScreen />} />
    </Routes>
  );
};

export default AppRoutes;