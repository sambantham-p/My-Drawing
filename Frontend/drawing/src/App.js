import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';

import Board from './components/Board/Board';
import Container from '../src/components/Container/Container';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home/Home';
import React from 'react';
import routeConstant from './routes/routeConstant';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path={routeConstant.BOARD} element={<Board />} />
          <Route path={routeConstant.CONTAINER} element={<Container />} />
          <Route path={routeConstant.HOME} element={<Home />} />
          <Route path={routeConstant.ERROR} element={<ErrorPage />} />
          <Route
            path='*'
            element={<Navigate to={routeConstant.ERROR} replace={true} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
