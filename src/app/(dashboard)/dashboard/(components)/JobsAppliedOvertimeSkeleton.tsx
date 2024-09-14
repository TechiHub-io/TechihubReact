import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const JobsAppliedOvertimeSkeleton: React.FC = () => {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-6 w-[200px]" />
        <Skeleton className="h-9 w-[180px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-4 w-[250px] mx-auto mt-2" />
      </CardContent>
    </Card>
  );
};

export default JobsAppliedOvertimeSkeleton;