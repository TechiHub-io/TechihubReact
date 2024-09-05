import React from 'react';

const BouncingCirclesLoader = () => {
  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="30" viewBox="0 0 100 30">
        <circle cx="20" cy="15" r="8" fill="#4CAF50">
          <animate
            attributeName="cy"
            values="15;5;15"
            dur="0.6s"
            repeatCount="indefinite"
            begin="0s"
          />
        </circle>
        <circle cx="50" cy="15" r="8" fill="#81C784">
          <animate
            attributeName="cy"
            values="15;5;15"
            dur="0.6s"
            repeatCount="indefinite"
            begin="0.2s"
          />
        </circle>
        <circle cx="80" cy="15" r="8" fill="#A5D6A7">
          <animate
            attributeName="cy"
            values="15;5;15"
            dur="0.6s"
            repeatCount="indefinite"
            begin="0.4s"
          />
        </circle>
      </svg>
      <p className="mt-2 text-green-600 font-medium">Getting things ready...</p>
    </div>
  );
};

export default BouncingCirclesLoader;