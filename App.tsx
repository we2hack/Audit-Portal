import React, { useState, useMemo, useCallback } from 'react';
import { AuditFinding, AppView } from './types';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import AuditTable from './components/AuditTable';
import Leaderboard from './components/Leaderboard';
import { InfoIcon } from './components/Icons';

const REQUIRED_COLUMNS = [
  'Category',
  'Question',
  'Responsible Team',
  'Issue Finding Date',
  'Issue Closed Date',
  'Reopen Dates',
  'Status',
  'Reopen Count',
  'Accumulated Points',
];

const App: React.FC = () => {
  const [auditData, setAuditData] = useState<AuditFinding[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.Dashboard);
  const [fileName, setFileName] = useState<string>('');

  const handleFileProcess = useCallback((file: File) => {
    setLoading(true);
    setError(null);
    setAuditData([]);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = window.XLSX.read(data, { type: 'array', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = window.XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          throw new Error("The uploaded file is empty or in an unsupported format.");
        }

        const headers = Object.keys(jsonData[0]);
        for (const col of REQUIRED_COLUMNS) {
          // A flexible check for column names, ignoring case and extra spaces.
          if (!headers.some(h => h.trim().toLowerCase() === col.trim().toLowerCase())) {
            throw new Error(`Missing required column: "${col}". Please ensure your Excel file contains all required columns.`);
          }
        }
        
        const keyMap = Object.fromEntries(
          REQUIRED_COLUMNS.map(col => [col, headers.find(h => h.trim().toLowerCase() === col.trim().toLowerCase())!])
        );
        

        const processedData = jsonData.map((row, index) => {
          const issueFindingDate = new Date(row[keyMap['Issue Finding Date']]);
          const issueClosedDate = row[keyMap['Issue Closed Date']] ? new Date(row[keyMap['Issue Closed Date']]) : null;
          const reopenDate = row[keyMap['Reopen Dates']] ? new Date(row[keyMap['Reopen Dates']]) : null;
          
          if (isNaN(issueFindingDate.getTime())) {
            throw new Error(`Invalid date format in row ${index + 2} for 'Issue Finding Date'.`);
          }

          let daysToClose: number | null = null;

          if (issueClosedDate) {
             if (isNaN(issueClosedDate.getTime())) {
                throw new Error(`Invalid date format in row ${index + 2} for 'Issue Closed Date'.`);
            }
            daysToClose = Math.ceil((issueClosedDate.getTime() - issueFindingDate.getTime()) / (1000 * 3600 * 24));
          }

          const statusFromFile = row[keyMap['Status']];
          let status: AuditFinding['status'] = 'Open';
          
          const validStatuses = ['Open', 'Closed - Timely', 'Closed - Late', 'Re-Opened', 'Reopened'];
          if (validStatuses.some(s => s.toLowerCase() === statusFromFile?.toLowerCase())) {
              if (statusFromFile.toLowerCase() === 'reopened') {
                  status = 'Re-Opened';
              } else {
                  status = statusFromFile as AuditFinding['status'];
              }
          } else {
             // If status is not provided or invalid, determine it based on dates
             if (reopenDate) status = 'Re-Opened';
             else if (issueClosedDate) status = 'Closed - Timely'; // Simplified assumption
             else status = 'Open';
          }

          const points = Number(row[keyMap['Accumulated Points']]);
          const reopenCount = Number(row[keyMap['Reopen Count']]);

          return {
            id: index,
            category: row[keyMap['Category']],
            question: row[keyMap['Question']],
            issueFindingDate,
            issueClosedDate,
            reopenDate,
            responsiblePerson: row[keyMap['Responsible Team']],
            status,
            points: isNaN(points) ? 0 : points,
            daysToClose,
            reopenCount: isNaN(reopenCount) ? 0 : reopenCount,
          };
        });

        setAuditData(processedData);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred while processing the file.");
        setAuditData([]);
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read the file.");
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const renderContent = useMemo(() => {
    if (auditData.length === 0) {
      return (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md border border-gray-200">
           <InfoIcon className="w-12 h-12 mx-auto text-brand-primary" />
           <h3 className="mt-4 text-xl font-semibold text-brand-secondary">Welcome to the ARMP</h3>
           <p className="mt-2 text-gray-500">Upload an Excel file to get started. Your dashboard, findings, and team leaderboard will appear here.</p>
           <p className="mt-4 text-sm text-gray-400">Required Columns: {REQUIRED_COLUMNS.join(', ')}</p>
        </div>
      );
    }

    switch (currentView) {
      case AppView.Dashboard:
        return <Dashboard data={auditData} />;
      case AppView.Findings:
        return <AuditTable data={auditData} />;
      case AppView.Leaderboard:
        return <Leaderboard data={auditData} />;
      default:
        return null;
    }
  }, [auditData, currentView]);

  return (
    <div className="min-h-screen bg-gray-50 text-brand-secondary">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
          <FileUpload onFileProcess={handleFileProcess} loading={loading} error={error} fileName={fileName} />
        </div>
        
        {auditData.length > 0 && (
          <div className="mb-8">
             <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {(Object.keys(AppView) as Array<keyof typeof AppView>).map((key) => (
                    <button
                      key={key}
                      onClick={() => setCurrentView(AppView[key])}
                      className={`
                        ${currentView === AppView[key] 
                          ? 'border-brand-primary text-brand-primary' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none
                      `}
                    >
                      {AppView[key]}
                    </button>
                  ))}
                </nav>
              </div>
          </div>
        )}

        {renderContent}
      </main>
    </div>
  );
};

export default App;