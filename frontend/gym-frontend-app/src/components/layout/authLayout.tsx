// src/components/layout/AuthLayout.tsx
import React from 'react';
import { AuthLayoutProps } from '../../types';


export default function AuthLayout({ children, sidebar, systemError }: AuthLayoutProps) {
  return (
    <div className="h-screen flex overflow-hidden">
      {systemError}
      
      <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
        {children}
      </div>
      
      {sidebar}
    </div>
  );
}