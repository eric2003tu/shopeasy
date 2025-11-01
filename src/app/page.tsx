// "use client";
// import Home from '@/components/small/Home';
// import React, { useEffect } from 'react';
// import { useAuth } from '@/context/AuthProvider';
// import { useRouter } from 'next/navigation';

// const Page: React.FC = () => {
//   const auth = useAuth();
//   const router = useRouter();
//   useEffect(() => {
//     if (auth.user) router.replace('/shop');
//   }, [auth.user, router]);

//   return (
//     <div className=''>
//       <Home />
//     </div>
//   );
// };

// export default Page;
"use client";
import Products from '@/components/small/Products';
import React from 'react';


const page: React.FC = () => {
  return (
    <div>
      <Products />
    </div>
  );
};

export default page;

