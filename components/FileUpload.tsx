
import React, { useState, useCallback } from 'react';
import { UploadIcon, FileIcon } from './Icons';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        setFileName(file.name);
        onFileSelect(file);
      } else {
        alert('Please upload a valid PDF file.');
        setFileName(null);
        onFileSelect(null);
      }
    } else {
      setFileName(null);
      onFileSelect(null);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);
  
  const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);
  
  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileChange(e.dataTransfer.files);
  }, []);


  return (
    <div>
      <label
        htmlFor="file-upload"
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragOver ? 'border-sky-400 bg-slate-700' : 'border-slate-600 bg-slate-800 hover:bg-slate-700'}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {fileName ? (
            <>
              <FileIcon className="w-10 h-10 mb-3 text-green-400" />
              <p className="mb-2 text-sm text-slate-300">
                <span className="font-semibold">{fileName}</span>
              </p>
              <p className="text-xs text-slate-500">Click or drag to replace</p>
            </>
          ) : (
            <>
              <UploadIcon className="w-10 h-10 mb-3 text-slate-400" />
              <p className="mb-2 text-sm text-slate-400">
                <span className="font-semibold text-sky-400">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-slate-500">PDF document only</p>
            </>
          )}
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={(e) => handleFileChange(e.target.files)}
        />
      </label>
    </div>
  );
};

export default FileUpload;
