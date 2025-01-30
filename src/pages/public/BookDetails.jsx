import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getBookDetails, getBorrowHistory } from '../../api/books';
import { Alert, AlertDescription } from '../../components/common/alert';
import { BookOpen, Users, Calendar, AlertCircle, LibraryBig } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { Link } from 'react-router-dom';

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = React.useState(null);
  const [borrowHistory, setBorrowHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        const [bookRes, historyRes] = await Promise.all([
          getBookDetails(id),
          user?.role === 'staff' ? getBorrowHistory(id) : Promise.resolve({ data: [] })
        ]);
        setBook(bookRes.data);
        setBorrowHistory(historyRes.data);
      } catch (err) {
        setError('Failed to load book details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Book not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Book Details Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {book.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                >
                  {tag.name}
                </span>
              ))}
            </div>

            {book.description && (
              <div className="prose max-w-none mt-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{book.description}</p>
              </div>
            )}
          </div>

          {/* Status Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Book Status</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  ISBN: {book.isbn}
                </span>
              </div>
              
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  Available: {book.available_quantity} / {book.total_quantity}
                </span>
              </div>

              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  Added on: {formatDate(book.created_at)}
                </span>
              </div>

              <div className="flex items-center">
                <LibraryBig className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  Location: Shelf {book.shelf || '?'} | Rack {book.rack || '?'}
                </span>
              </div>
            </div>

            {user?.role === 'staff' && (
              <div className="mt-6 space-y-3">
                <button
                  className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                  onClick={() => {/* Add issue book logic */}}
                >
                  Issue Book
                </button>
                <button
                  className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                  onClick={() => {/* Add update book logic */}}
                >
                  Update Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Borrow History Section (Staff Only) */}
      {user?.role === 'staff' && borrowHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Borrow History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Return Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {borrowHistory.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/profile/${record.student.username}`} className="hover:underline">
                        {record.student.first_name} {record.student.last_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(record.issued_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(record.due_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        {record.returned_at ? formatDate(record.returned_at) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${record.status === 'returned' 
                          ? 'bg-green-100 text-green-800' 
                          : record.is_overdue 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'}`}
                      >
                        {record.is_overdue ? 'OVERDUE' : record.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;