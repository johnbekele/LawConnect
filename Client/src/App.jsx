import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './components/Home';
import LoginPage from './components/LoginPage';
import SignUp from './components/SignUp';
import NoPage from './components/SignUp';
import MyCases from './components/MyCases';
import Fees from './components/Fees';
import Clients from './components/Clients';
import Profile from './components/Profile';
import ForgetPassword from './components/ForgetPassword';
import LandingPage from './components/LandingPage';
import './App.css'; // Import your main CSS file

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signUp',
    element: <SignUp />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/myCases',
    element: <MyCases />,
  },
  {
    path: '/fees',
    element: <Fees />,
  },
  {
    path: '/clients',
    element: <Clients />,
  },
  // {
  //   path: "/clients/addClient",
  //   element: <AddClients/>
  // },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/forget-password',
    element: <ForgetPassword />,
  },
  {
    path: '*',
    element: <NoPage />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
