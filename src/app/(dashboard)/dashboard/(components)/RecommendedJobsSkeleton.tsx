import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const RecommendedJobsSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[200px]" />
      </CardHeader>
      <CardContent>
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex items-center justify-between mb-4 last:mb-0">
            <div className="flex items-center">
              <Skeleton className="w-8 h-8 mr-3 rounded" />
              <div>
                <Skeleton className="h-4 w-[150px] mb-2" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
            </div>
            <Skeleton className="h-9 w-[60px]" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecommendedJobsSkeleton;