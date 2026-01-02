import React from 'react';
import { Navigate } from 'react-router-dom';

const Admin: React.FC = () => {
  return <Navigate to="/admin" replace />;
};

export default Admin;