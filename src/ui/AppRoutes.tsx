import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';

const AppRoutes = () => {
  return (
    <HashRouter>
      <Routes location={'/'}>
        <Route path="/" Component={Home} />
      </Routes>
    </HashRouter>
  );
};

export default AppRoutes;
