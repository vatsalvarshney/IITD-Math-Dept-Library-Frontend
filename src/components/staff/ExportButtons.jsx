import React from 'react';
import { Download } from 'lucide-react';
import axios from '../../api/axios';

const ExportButton = ({ onClick, children, loading }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
      ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-50 border border-gray-500 text-gray-500 hover:bg-gray-100 cursor-pointer'}
    `}
  >
    <Download className="h-4 w-4" />
    {loading ? 'Exporting...' : children}
  </button>
);

const ExportButtons = () => {
  const [loading, setLoading] = React.useState('');

  const handleExport = async (type) => {
    try {
      setLoading(type);
      
      // Get the JWT token from localStorage
      const token = localStorage.getItem('token');
      
      // Make GET request with proper headers
      const response = await axios({
        method: 'get',
        url: `/api/export/books${type === 'detailed' ? '/detailed' : ''}/`,
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Create blob and download file
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = type === 'detailed' ? 'books_detailed.csv' : 'books.csv';
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="flex gap-4">
      <ExportButton
        onClick={() => handleExport('basic')}
        loading={loading === 'basic'}
      >
        Export Books Data
      </ExportButton>
      
      <ExportButton
        onClick={() => handleExport('detailed')}
        loading={loading === 'detailed'}
      >
        Export Detailed Data
      </ExportButton>
    </div>
  );
};

export default ExportButtons;