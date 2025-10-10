import React from 'react';
import SampleProjects from '@/components/small/SampleProjects';

export const metadata = {
  title: 'Projects - ShopEasy',
  description: 'Example sample projects'
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Projects</h1>
        <p className="text-gray-600 mb-8">A few sample projects demonstrating common e-commerce features.</p>
        <SampleProjects />
      </div>
    </main>
  );
}
