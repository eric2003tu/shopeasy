"use client";
import Home from '@/components/small/Home';
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';

const page: React.FC = () => {
  const auth = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (auth.user) router.replace('/shop');
  }, [auth.user, router]);

  return (
    <div className=''>
      <Home />
    </div>
  );
};

export default page;
