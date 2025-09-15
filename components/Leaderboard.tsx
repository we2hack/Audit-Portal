import React, { useMemo } from 'react';
import { AuditFinding, TeamLeaderboardEntry } from '../types';
import { TrophyIcon, TrendingUpIcon, TrendingDownIcon, ClockIcon } from './Icons';

interface LeaderboardProps {
  data: AuditFinding[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  const leaderboardData = useMemo<TeamLeaderboardEntry[]>(() => {
    const teamStats: { [key: string]: TeamLeaderboardEntry } = {};

    data.forEach(finding => {
      const teamName = finding.responsiblePerson;
      if (!teamStats[teamName]) {
        teamStats[teamName] = {
          teamName: teamName,
          totalPoints: 0,
          timelyClosed: 0,
          lateClosed: 0,
          reOpened: 0,
          stillOpen: 0,
        };
      }
      teamStats[teamName].totalPoints += finding.points;
      if (finding.status === 'Closed - Timely') teamStats[teamName].timelyClosed++;
      else if (finding.status === 'Closed - Late') teamStats[teamName].lateClosed++;
      else if (finding.status === 'Re-Opened') teamStats[teamName].reOpened++;
      else if (finding.status === 'Open') teamStats[teamName].stillOpen++;
    });

    return Object.values(teamStats).sort((a, b) => b.totalPoints - a.totalPoints);
  }, [data]);
  
  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = window.Recharts;


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-200">
             <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Team/Individual Rankings</h3>
             <ul role="list" className="divide-y divide-gray-200">
                {leaderboardData.map((team, index) => (
                    <li key={team.teamName} className="py-4 flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-light flex items-center justify-center text-lg font-bold text-brand-secondary">
                            {index === 0 ? <TrophyIcon className="h-6 w-6 text-yellow-500"/> : index + 1}
                        </div>
                        <div className="ml-4 flex-1">
                            <p className="text-sm font-medium text-brand-primary truncate">{team.teamName}</p>
                            <div className="flex items-center text-sm text-gray-500 space-x-2 mt-1">
                                <span title="Timely Closed"><TrendingUpIcon className="h-4 w-4 text-green-500" /> {team.timelyClosed}</span>
                                <span title="Re-Opened"><TrendingDownIcon className="h-4 w-4 text-red-500" /> {team.reOpened}</span>
                                <span title="Still Open"><ClockIcon className="h-4 w-4 text-yellow-500" /> {team.stillOpen}</span>
                            </div>
                        </div>
                        <div className="text-right">
                           <p className="text-lg font-semibold text-brand-secondary">{team.totalPoints} pts</p>
                        </div>
                    </li>
                ))}
             </ul>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Points Distribution</h3>
             <ResponsiveContainer width="100%" height={400}>
                <BarChart data={leaderboardData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="teamName" type="category" width={100} tick={{fontSize: 12}}/>
                    <Tooltip cursor={{fill: '#f4f5f7'}}/>
                    <Legend />
                    <Bar dataKey="totalPoints" name="Total Points" fill="#0052cc" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default Leaderboard;
