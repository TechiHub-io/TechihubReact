import React from 'react';

const BouncingCirclesLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <svg width="150" height="50" viewBox="0 0 150 50" className="mb-4">
        <circle cx="30" cy="25" r="10" fill="#4CAF50">
          <animate
            attributeName="cy"
            values="25;10;25"
            dur="0.8s"
            repeatCount="indefinite"
            begin="0s"
          />
        </circle>
        <circle cx="75" cy="25" r="10" fill="#81C784">
          <animate
            attributeName="cy"
            values="25;10;25"
            dur="0.8s"
            repeatCount="indefinite"
            begin="0.3s"
          />
        </circle>
        <circle cx="120" cy="25" r="10" fill="#A5D6A7">
          <animate
            attributeName="cy"
            values="25;10;25"
            dur="0.8s"
            repeatCount="indefinite"
            begin="0.6s"
          />
        </circle>
      </svg>
      <p className="text-green-600 font-medium">Getting things ready...</p>
    </div>
  );
};

export default BouncingCirclesLoader;