import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileStrengthSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-[200px]" />
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <Skeleton className="h-32 w-32 rounded-full" />
      </CardContent>
      <div className="px-6 pb-4">
        <Skeleton className="h-4 w-full" />
      </div>
    </Card>
  );
};

export default ProfileStrengthSkeleton;