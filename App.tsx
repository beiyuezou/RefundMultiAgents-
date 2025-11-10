
import React, { useState, useCallback } from 'react';
import type { RefundResponse } from './types';
import { analyzeRefundEvidence } from './services/geminiService';
import FileUpload from './components/FileUpload';
import ResultsDisplay from './components/ResultsDisplay';
import { LogoIcon } from './components/Icons';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<RefundResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = useCallback(async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await analyzeRefundEvidence(file);
      setResult(response);
    } catch (err) {
      if (err instanceof Error) {
        setError(`An error occurred: ${err.message}`);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [file]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <LogoIcon className="w-12 h-12 text-sky-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Refund Multi-Agent System</h1>
            <p className="text-slate-400">Upload your PDF evidence to generate a refund appeal.</p>
          </div>
        </header>

        <main>
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 shadow-lg">
            <FileUpload onFileSelect={handleFileSelect} />
            <div className="mt-6 text-center">
              <button
                onClick={handleAnalyze}
                disabled={!file || isLoading}
                className="w-full sm:w-auto bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center mx-auto"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  'Generate Appeal'
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-8">
              <ResultsDisplay result={result} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
