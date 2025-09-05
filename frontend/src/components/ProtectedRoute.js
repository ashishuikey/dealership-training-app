import React from 'react';

function ProtectedRoute({ children, requiredRole, userRole, allowedRoles = [] }) {
  // If specific role is required, check it
  if (requiredRole && userRole !== requiredRole) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50vh',
        flexDirection: 'column',
        color: '#718096',
        textAlign: 'center'
      }}>
        <h2>🚫 Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <p>Required role: <strong>{requiredRole}</strong></p>
        <p>Your role: <strong>{userRole}</strong></p>
      </div>
    );
  }
  
  // If allowed roles are specified, check if user role is in the list
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50vh',
        flexDirection: 'column',
        color: '#718096',
        textAlign: 'center'
      }}>
        <h2>🚫 Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <p>Allowed roles: <strong>{allowedRoles.join(', ')}</strong></p>
        <p>Your role: <strong>{userRole}</strong></p>
      </div>
    );
  }
  
  // User has access, render the protected content
  return children;
}

export default ProtectedRoute;