import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const URL = process.env.REACT_APP_API_URL;

const defaultContextValue = {
  isAuthenticated: false,
  login: (token) => {},
  logout: () => {},
  partyData: null,
};

const AuthContext = createContext(defaultContextValue);

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = Date.now() >= decoded.exp * 1000; // Check if token is expired
        return !isExpired;
      } catch (error) {
        return false;
      }
    }
    return false;
  });
  const [partyData, setPartyData] = useState(null);

  const fetchPartyData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(`${URL}/protected/party`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setPartyData(response.data.party); // Assuming response.data contains party details
      }
    } catch (error) {
      console.error('Failed to fetch party data:', error);
    }
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    fetchPartyData(); // Fetch party data upon login
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setPartyData(null); // Clear party data on logout
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPartyData(); // Fetch party data when the user is authenticated on initial load
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, partyData }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
