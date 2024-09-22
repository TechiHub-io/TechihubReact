// components/BioSection.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BioSectionProps {
  bio: string;
}

const BioSection: React.FC<BioSectionProps> = ({ bio }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Bio</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{bio}</p>
      </CardContent>
    </Card>
  );
};

export default BioSection;