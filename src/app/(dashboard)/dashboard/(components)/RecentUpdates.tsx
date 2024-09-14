import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Update {
  content: string;
  time: string;
}

interface RecentUpdatesProps {
  updates: Update[];
}

const RecentUpdates: React.FC<RecentUpdatesProps> = ({ updates }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Updates</CardTitle>
      </CardHeader>
      <CardContent>
        {updates.map((update, index) => (
          <div key={index} className="mb-4 last:mb-0">
            <p className="font-semibold">{update.content}</p>
            <p className="text-sm text-gray-500">{update.time}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentUpdates;