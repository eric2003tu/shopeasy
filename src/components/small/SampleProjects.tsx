"use client";
import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

const sampleProjects = [
  {
    id: 'p1',
    title: 'E-commerce Storefront',
    description: 'A fully responsive store with carts, checkout and product management.',
    tags: ['Next.js', 'Tailwind', 'Stripe']
  },
  {
    id: 'p2',
    title: 'Marketplace Admin',
    description: 'Admin dashboard for managing sellers, orders and analytics.',
    tags: ['React', 'Chart.js', 'Postgres']
  },
  {
    id: 'p3',
    title: 'Mobile Shop App',
    description: 'Cross-platform mobile app for browsing and purchasing products.',
    tags: ['React Native', 'Expo', 'Firebase']
  }
];

const SampleProjects: React.FC = () => {
  const { t } = useI18n();
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t('projects.sampleTitle')}</h2>
          <Link href="/projects" className="text-sm text-indigo-600 hover:underline">{t('projects.seeAll')}</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleProjects.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{p.title}</h3>
              <p className="text-gray-600 mb-4">{p.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {p.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">{tag}</span>
                ))}
              </div>
              <Link href="#" className="inline-block text-sm font-medium text-indigo-600 hover:underline">{t('projects.viewDetails')}</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SampleProjects;
