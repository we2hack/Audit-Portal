
import React, { useMemo } from 'react';
import { AuditFinding } from '../types';
import { CollectionIcon, CheckCircleIcon, ExclamationCircleIcon, ClockIcon } from './Icons';

interface DashboardProps {
  data: AuditFinding[];
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
        <div className="p-5">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    {icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                        <dd className="text-3xl font-semibold text-gray-900">{value}</dd>
                    </dl>
                </div>
            </div>
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const stats = useMemo(() => {
    const totalFindings = data.length;
    const openFindings = data.filter(d => d.status === 'Open').length;
    const closedFindings = totalFindings - openFindings;
    const reOpenedFindings = data.filter(d => d.status === 'Re-Opened').length;

    const closedWithDuration = data.filter(d => d.daysToClose !== null);
    const avgTimeToClosure = closedWithDuration.length > 0
      ? (closedWithDuration.reduce((acc, curr) => acc + curr.daysToClose!, 0) / closedWithDuration.length).toFixed(1)
      : 'N/A';
    
    return {
      totalFindings,
      openFindings,
      closedFindings,
      reOpenedFindings,
      avgTimeToClosure
    };
  }, [data]);

  return (
    <div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
           <StatCard 
                title="Total Findings" 
                value={stats.totalFindings} 
                icon={<CollectionIcon className="h-8 w-8 text-white bg-brand-primary p-1 rounded-md" />}
            />
            <StatCard 
                title="Open Findings" 
                value={stats.openFindings} 
                icon={<ExclamationCircleIcon className="h-8 w-8 text-white bg-yellow-500 p-1 rounded-md" />}
            />
            <StatCard 
                title="Closed Findings" 
                value={stats.closedFindings} 
                icon={<CheckCircleIcon className="h-8 w-8 text-white bg-green-500 p-1 rounded-md" />}
            />
            <StatCard 
                title="Avg. Time to Close (Days)" 
                value={stats.avgTimeToClosure} 
                icon={<ClockIcon className="h-8 w-8 text-white bg-indigo-500 p-1 rounded-md" />}
            />
        </div>
    </div>
  );
};

export default Dashboard;
