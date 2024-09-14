import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface JobsData {
  name: string;
  value: number;
}

interface JobsAppliedOvertimeProps {
  data: JobsData[];
}

const JobsAppliedOvertime: React.FC<JobsAppliedOvertimeProps> = ({ data }) => {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Jobs applied Overtime</CardTitle>
        <Select defaultValue="6 months">
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
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#0CCE68" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">
          total jobs applied for the last 6 months
        </p>
      </CardContent>
    </Card>
  );
};

export default JobsAppliedOvertime;