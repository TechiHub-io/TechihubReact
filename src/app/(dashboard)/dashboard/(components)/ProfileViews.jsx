import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProfileViews = ({ viewsData }) => {
  const [timeRange, setTimeRange] = useState("6 months");
  const maxViews = Math.max(...viewsData.map(item => item.views));

  return (
    <Card className="col-span-2 max-w-[500px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Profile views</CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6 months">Last 6 months</SelectItem>
            <SelectItem value="3 months">Last 3 months</SelectItem>
            <SelectItem value="1 month">Last month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {viewsData.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <div className="w-20 text-sm font-medium">{item.name}</div>
            <div className="flex-1 h-4 bg-green-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${(item.views / maxViews) * 100}%` }}
              ></div>
            </div>
            <div className="w-12 text-sm font-medium text-right">{item.views}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProfileViews;