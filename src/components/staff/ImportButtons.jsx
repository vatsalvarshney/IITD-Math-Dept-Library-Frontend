import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import axios from '../../api/axios';

const ImportButton = ({ onClick, children, loading }) => {
  const fileInputRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <input 
        type="file"
        ref={fileInputRef}
        onChange={onClick}
        accept=".csv"
        className="absolute opacity-0 w-0 h-0"
      />
      <button
        onClick={handleClick}
        disabled={loading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-center
          ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-50 border border-gray-500 text-gray-500 hover:bg-gray-100 cursor-pointer'}
        `}
      >
        <Upload className="h-4 w-4" />
        {loading ? 'Importing...' : children}
      </button>

      {hovered && !loading && (
        <div className="absolute top-full w-60 bg-black text-white text-base rounded px-3 py-2 shadow-md z-10 text-center break-words">
          Use this functionality to update the database with new books added in the <a className="text-blue-500 underline" href="https://docs.google.com/spreadsheets/d/1W-0S-nxoNCJOd_idaAkcJ6T7FVZja_2W3vgwgcQbMGs/edit?usp=sharing" target="_blank" rel="noopener noreferrer">Google Sheet</a>. Download the sheet in CSV format and upload here as it is. All the books which were not present earlier will be added, nothing would be deleted.
        </div>
      )}
    </div>
  );
};



const ImportButtons = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setResults(null);
      
      // Get the JWT token from localStorage
      const token = localStorage.getItem('token');
      
      // Create form data
      const formData = new FormData();
      formData.append('booksCsv', file);
      
      // Make POST request with proper headers
      const response = await axios({
        method: 'post',
        url: '/api/upload/books/csv',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Set results for display
      setResults(response.data);
      
      // Clear the file input for future use
      e.target.value = '';
      
    } catch (err) {
      console.error('Import failed:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to import data. Please try again.'
      );
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ImportButton
        onClick={handleFileChange}
        loading={loading}
      >
        Import Books from CSV
      </ImportButton>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <strong>Error: </strong>{error}
        </div>
      )}
      
      {results && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
          <div className="font-medium">{results.message}</div>
          
          {results.errors && results.errors.length > 0 && (
            <div className="mt-3">
              <div className="font-medium mb-2">Issues found:</div>
              <ul className="list-disc pl-5">
                {results.errors.map((err, idx) => (
                  <li key={idx}>
                    Row {err.row} - {err.title}: {err.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImportButtons;