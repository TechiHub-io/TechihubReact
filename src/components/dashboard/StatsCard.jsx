// src/components/dashboard/StatsCard.jsx
import React from 'react';
import Image from 'next/image';

export default function StatsCard({ title, value, icon, bgColor, textColor }) {
  return (
    <div className={`${bgColor} ${textColor} rounded-lg p-4 shadow flex justify-between items-center`}>
      <div>
        <h3 className="text-lg font-medium opacity-90">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className="w-12 h-12 flex items-center justify-center">
        {icon && (
          <Image 
            src={icon} 
            alt={title} 
            width={32}
            height={32}
            className="opacity-90"
          />
        )}
      </div>
    </div>
  );
}