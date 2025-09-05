import React from 'react';

function ProgressTest() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ color: '#0891B2', fontSize: '3rem' }}>TEST - Progress Page is Loading!</h1>
      <p style={{ fontSize: '1.5rem', color: '#10B981' }}>If you can see this, the component is working.</p>
      <div style={{ 
        width: '400px', 
        height: '250px', 
        background: 'linear-gradient(135deg, #0891B2 0%, #10B981 100%)',
        margin: '2rem auto',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '2rem'
      }}>
        Carousel Test Box
      </div>
    </div>
  );
}

export default ProgressTest;