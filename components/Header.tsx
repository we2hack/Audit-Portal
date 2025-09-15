
import React from 'react';
import { ChartBarIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-secondary shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <ChartBarIcon className="h-8 w-8 text-brand-accent" />
          <h1 className="text-2xl font-bold text-white">
            Audit & Reward Management Portal
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
