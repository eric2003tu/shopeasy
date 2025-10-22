import ProfileClient from '@/components/small/ProfileClient';

export const metadata = {
  title: 'Profile - ShopEasy',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <ProfileClient />
      </div>
    </div>
  );
}
