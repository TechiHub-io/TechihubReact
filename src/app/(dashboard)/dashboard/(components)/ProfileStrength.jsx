import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const ProfileStrength = ({ strength, userName }) => {
  const radius = 100;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (strength / 100) * circumference;

  return (
    <Card className="w-full ">
      <CardContent className="p-6 ">
        <h3 className="text-lg font-semibold mb-4">{userName}</h3>
        <h2 className="text-2xl font-bold mb-4">Profile strength</h2>
        <div className="flex justify-center items-center mb-4">
          <div className="relative">
            <svg
              height={radius * 2}
              width={radius * 2}
              className="transform -rotate-90"
            >
              <circle
                stroke="#e6e6e6"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="#22c55e"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold">{strength}%</span>
              <span className="text-sm">Complete</span>
            </div>
          </div>
        </div>
        <p className="text-center text-sm  text-gray-600">
          Complete your profile to increase your chances of being noticed by employers
        </p>
      </CardContent>
    </Card>
  );
};

export default ProfileStrength;