// "use client";
// import React, { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthProvider';

// export default function AuthGuard({ children }: { children: React.ReactNode }) {
//   const auth = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     // If not loading and no user, redirect to login
//     if (!auth.loading && !auth.user) {
//       router.replace('/login');
//     }
//   }, [auth.loading, auth.user, router]);

//   // While loading or not authenticated, don't render children
//   if (auth.loading || !auth.user) return null;

//   return <>{children}</>;
// }
