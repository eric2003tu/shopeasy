"use client";
import React from 'react';
import SampleProjects from './SampleProjects';
import { useI18n } from '@/i18n/I18nProvider';

const ProjectsClient: React.FC = () => {
  const { t } = useI18n();
  return (
    <main className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('projects.title')}</h1>
        <p className="text-gray-600 mb-8">{t('projects.subtitle')}</p>
        <SampleProjects />
      </div>
    </main>
  );
};

export default ProjectsClient;
