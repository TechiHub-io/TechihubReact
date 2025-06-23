// src/app/dashboard/employer/page.js
'use client';
import React from 'react';
import EmployerDashboard from '@/components/dashboard/EmployerDashboard';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function EmployerDashboardPage() {

  return (
    <DashboardLayout>
      <EmployerDashboard />
    </DashboardLayout>
  )
}