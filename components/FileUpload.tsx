
import React, { useRef } from 'react';
import { UploadIcon, FileIcon, AlertIcon, SpinnerIcon } from './Icons';

interface FileUploadProps {
  onFileProcess: (file: File) => void;
  loading: boolean;
  error: string | null;
  fileName: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcess, loading, error, fileName }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileProcess(file);
    }
     if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileProcess(file);
    }
  };
  
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-brand-secondary mb-4">Import Audit Data</h2>
      <label
        htmlFor="file-upload"
        className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-brand-primary cursor-pointer transition-colors duration-200 bg-gray-50"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
        <span className="mt-2 block text-sm font-medium text-gray-900">
          Drag & drop your Excel file here or <span className="text-brand-primary">browse</span>
        </span>
        <input
          ref={fileInputRef}
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          disabled={loading}
        />
      </label>
      
      <div className="mt-4 h-12">
        {loading && (
          <div className="flex items-center text-gray-600">
            <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-primary" />
            <span>Processing "{fileName}"...</span>
          </div>
        )}
        {!loading && fileName && !error && (
            <div className="flex items-center text-green-700 bg-green-100 p-3 rounded-md">
                 <FileIcon className="h-5 w-5 mr-3" />
                 <span>Successfully processed "{fileName}". View the data below.</span>
            </div>
        )}
        {error && (
          <div className="flex items-center text-red-700 bg-red-100 p-3 rounded-md">
            <AlertIcon className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default FileUpload;
