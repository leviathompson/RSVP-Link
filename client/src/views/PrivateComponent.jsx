import React from 'react';
import { useAuth } from '../context/AuthProvider';
const PrivateComponent = () => {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };
  return (
    <div>
      <h2>Private Component</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
export default PrivateComponent;