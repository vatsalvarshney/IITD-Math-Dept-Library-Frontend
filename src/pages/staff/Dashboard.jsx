import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getDashboardStats, 
  getStaffBooks, 
  issueBook, 
  returnBook 
} from '../../api/staff';
import { Download, Plus, Search } from 'lucide-react';
import StatsBox from '../../components/staff/StatsBox';
import IssueBookModal from '../../components/staff/IssueBookModal';
import { formatDate, truncatedText } from '../../lib/utils';
import { Link } from 'react-router-dom';
import ExportButtons from '../../components/staff/ExportButtons';
import ImportButtons from '../../components/staff/ImportButtons';

const Dashboard = () => {
  const [stats, setStats] = React.useState(null);
  const [books, setBooks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedBook, setSelectedBook] = React.useState(null);
  const [showIssueModal, setShowIssueModal] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, booksRes] = await Promise.all([
        getDashboardStats(),
        getStaffBooks()
      ]);
      setStats(statsRes.data);
      setBooks(booksRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueBook = async (data) => {
    try {
      await issueBook(data);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error issuing book:', error);
    }
  };

  const handleReturnBook = async (borrowId) => {
    if (window.confirm('Confirm book return?')) {
      try {
        await returnBook(borrowId);
        fetchDashboardData(); // Refresh data
      } catch (error) {
        console.error('Error returning book:', error);
      }
    }
  };

  const filteredBooks = React.useMemo(() => {
    let filtered = [...books];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery)
      );
    }
    
    // Apply status filter
    switch (activeFilter) {
      case 'issued':
        filtered = filtered.filter(book => book.issued_quantity > 0);
        break;
      case 'overdue':
        filtered = filtered.filter(book => 
          book.borrow_records?.some(record => record.is_overdue)
        ).map(book => ({
          ...book,
          borrow_records: book.borrow_records.filter(record => record.is_overdue)
        }));
        break;
    }
    
    return filtered;
  }, [books, searchQuery, activeFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/staff/add')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary-dark cursor-pointer"
          >
            <Plus className="h-5 w-5" />
            Add Book Manually
          </button>
          {/* <button
            onClick={() => {}}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Download className="h-5 w-5" />
            Export Data
          </button> */}
          <ImportButtons />
          <ExportButtons />
        </div>
      </div>

      {/* if mobile then show warning */}
      <div className="mb-4 bg-red-100 border-l-4 border-red-400 p-4 rounded-lg md:hidden">
        <p className="text-sm text-gray-500">
          Note: This dashboard is not optimized for mobile devices. Please use a desktop.
        </p>
      </div>

      {/* Stats Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsBox
          title="All Books"
          value={stats.total_books}
          onClick={() => setActiveFilter('all')}
          isActive={activeFilter === 'all'}
        />
        <StatsBox
          title="Issued Books"
          value={stats.issued_books}
          onClick={() => setActiveFilter('issued')}
          isActive={activeFilter === 'issued'}
        />
        <StatsBox
          title="Overdue Returns"
          value={stats.overdue_books}
          onClick={() => setActiveFilter('overdue')}
          isActive={activeFilter === 'overdue'}
        />
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search books by title, author, or ISBN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>

      {/* Books Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Borrowers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBooks.map((book) => (
              <tr key={book.id}>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <a
                      href={`/books/${book.id}`}
                      className="text-lg font-medium text-gray-900 hover:text-primary"
                    >
                      {truncatedText(book.title)}
                    </a>
                    <span className="text-sm text-gray-500">
                      by {truncatedText(book.author)}
                    </span>
                    <span className="text-sm text-gray-400">
                      ISBN: {book.isbn}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">
                      Total: {book.total_quantity}
                    </span>
                    <span className="text-sm text-gray-500">
                      Available: {book.available_quantity}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {book.borrow_records?.map((record) => (
                    <div 
                      key={record.id} 
                      className="flex justify-between items-center mb-2 bg-gray-100 p-2 rounded-lg"
                    >
                      <div className="flex flex-col">
                        <Link to={`/profile/${record.student_username}`} className="text-sm font-medium hover:underline">
                          {record.student_name}
                        </Link>
                        <span className="text-xs text-gray-500">
                          Due: {formatDate(new Date(record.due_at))}
                        </span>
                      </div>
                      <button
                        onClick={() => handleReturnBook(record.id)}
                        className="text-sm text-primary hover:underline cursor-pointer"
                      >
                        Return
                      </button>
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedBook(book);
                        setShowIssueModal(true);
                      }}
                      disabled={book.available_quantity === 0}
                      className="text-sm text-white bg-primary px-3 py-1 rounded hover:bg-primary-dark disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                      Issue
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Issue Book Modal */}
      {showIssueModal && selectedBook && (
        <IssueBookModal
          book={selectedBook}
          onClose={() => {
            setShowIssueModal(false);
            setSelectedBook(null);
          }}
          onIssue={handleIssueBook}
        />
      )}
    </div>
  );
};

export default Dashboard;