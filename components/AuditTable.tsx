import React from 'react';
import { AuditFinding } from '../types';

interface AuditTableProps {
  data: AuditFinding[];
}

const statusStyles: { [key in AuditFinding['status']]: string } = {
  'Open': 'bg-yellow-100 text-yellow-800',
  'Closed - Timely': 'bg-green-100 text-green-800',
  'Closed - Late': 'bg-gray-100 text-gray-800',
  'Re-Opened': 'bg-red-100 text-red-800',
};

const pointStyles: { [key: string]: string } = {
  positive: 'text-green-600 font-bold',
  negative: 'text-red-600 font-bold',
  neutral: 'text-gray-500',
};

const AuditTable: React.FC<AuditTableProps> = ({ data }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Audit Findings Details</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsible Team</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Finding Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Closed Date</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Reopen Count</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {data.map((finding) => (
                <tr key={finding.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{finding.category}</td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 max-w-xs">{finding.question}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{finding.responsiblePerson}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{finding.issueFindingDate.toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{finding.issueClosedDate?.toLocaleDateString() ?? 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[finding.status]}`}>
                            {finding.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{finding.reopenCount}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${finding.points > 0 ? pointStyles.positive : finding.points < 0 ? pointStyles.negative : pointStyles.neutral}`}>
                        {finding.points > 0 ? `+${finding.points}` : finding.points}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
    </div>
  );
};

export default AuditTable;