import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const API = import.meta.env.REACT_APP_API_URL // if using Vite

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await axios.get(`${API}/verify-token`, {
          withCredentials: true
        });
        if (res.data.valid) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, []);

  if (isChecking) return null; // or a loading spinner

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;