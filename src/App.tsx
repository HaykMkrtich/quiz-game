import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import GamePage from './components/GamePage';
import HomePage from './components/HomePage';
import { routes } from './constants/routes';
import styled from 'styled-components';

function App() {
  const router = createBrowserRouter([
    {
      path: routes.HOME,
      element: <HomePage />,
    },
    {
      path: routes.PLAYING,
      element: <GamePage />,
    },
  ]);
  return (
    <Wrapper>
      <RouterProvider router={router} />
    </Wrapper>
  );
}
const Wrapper = styled.div`
  padding: 20px 40px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-self: center;
`;

export default App;
