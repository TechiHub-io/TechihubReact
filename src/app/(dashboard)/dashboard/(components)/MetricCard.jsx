import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Bookmark, Briefcase, Eye } from 'lucide-react';

const iconMap = {
  'bell': Bell,
  'bookmark': Bookmark,
  'briefcase': Briefcase,
  'eye': Eye,
};

const MetricCard = ({ title, value, icon, bgColor, textColor }) => {
  const IconComponent = iconMap[icon];

  return (
    <Card className={`w-full ${bgColor} ${textColor}`}>
      <CardContent className="flex items-center justify-between p-6">
        <div className='flex flex-col gap-6'>
          <p className="text-sm text-white font-medium">{title}</p>
          <p className="text-2xl text-white font-bold">{value}</p>
        </div>
        {IconComponent && <IconComponent className="h-10 w-14" />}
      </CardContent>
    </Card>
  );
};

export default MetricCard;