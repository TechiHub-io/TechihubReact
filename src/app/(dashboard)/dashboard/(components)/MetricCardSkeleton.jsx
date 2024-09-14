import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const MetricCardSkeleton = () => {
  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-between p-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-7 w-[60px]" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </CardContent>
    </Card>
  );
};

export default MetricCardSkeleton;