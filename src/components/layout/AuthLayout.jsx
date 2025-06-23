// src/components/layout/AuthLayout.jsx
import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({ children}) {
  return (
    <main className="">
    <div className="w-full h-16 bg-[#364187] top-0 sticky" />
      
    {children}
    </main>
  );
}