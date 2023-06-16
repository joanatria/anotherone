import React from 'react';

function Loading() {
  return (
    <div
      className="loading-container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f9fa',
      }}
    >
      <style>
        {`
        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid black;
          border-top: 4px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        @keyframes spin {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        `}
      </style>

      <div className="spinner"></div>
    </div>
  );
}

export default Loading;