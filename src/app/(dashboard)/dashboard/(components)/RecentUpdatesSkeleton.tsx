import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const RecentUpdatesSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[150px]" />
      </CardHeader>
      <CardContent>
        {[...Array(4)].map((_, index) => (
          <div key={index} className="mb-4 last:mb-0">
            <Skeleton className="h-4 w-[200px] mb-2" />
            <Skeleton className="h-3 w-[100px]" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentUpdatesSkeleton;