import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUserProfile, getUserBorrowHistory } from '../../api/users';
import { formatDate } from '../../lib/utils';
import { Navigate } from 'react-router-dom';
import { truncatedText } from '../../lib/utils';
import { Link } from 'react-router-dom';

const BorrowHistoryTable = ({ records, current=false }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Book
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Issue Date
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Due Date
          </th>
          {current || (
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Return Date
          </th>
          )}
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {records.map((record) => (
          <tr key={record.id}>
            <td className="px-6 py-4 whitespace-nowrap">
            <Link to={`/books/${record.book.id}`} className="hover:underline">
              <div className="text-sm font-medium text-gray-900">{truncatedText(record.book.title)}</div>
              <div className="text-sm text-gray-500">{truncatedText(record.book.author)}</div>
            </Link>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatDate(record.issued_at)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatDate(record.due_at)}
            </td>
            {current || (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {record.returned_at ? formatDate(record.returned_at) : '-'}
            </td>
            )}
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  record.status === 'returned'
                    ? 'bg-green-100 text-green-800'
                    : record.is_overdue
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {record.is_overdue ? 'OVERDUE' : record.status.toUpperCase()}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Profile = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = React.useState(null);
  const [borrowHistory, setBorrowHistory] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const [profileData, historyData] = await Promise.all([
          getUserProfile(username),
          getUserBorrowHistory(username)
        ]);
        setProfile(profileData.data);
        setBorrowHistory(historyData.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [username]);

  if (!user || (user.username !== username && user.role !== 'staff')) {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const currentlyBorrowed = borrowHistory.filter(record => record.status === 'issued');
  const previouslyBorrowed = borrowHistory.filter(record => record.status === 'returned');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="text-lg">{profile.first_name} {profile.last_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg">{profile.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Username</p>
            <p className="text-lg">{profile.username}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-lg capitalize">{profile.role}</p>
          </div>
        </div>
      </div>

      {/* Currently Borrowed Books */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Currently Borrowed Books ({currentlyBorrowed.length})
        </h2>
        {currentlyBorrowed.length > 0 ? (
          <BorrowHistoryTable records={currentlyBorrowed} current={true} />
        ) : (
          <p className="text-gray-500">No books currently borrowed.</p>
        )}
      </div>

      {/* Borrowing History */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Borrowing History ({previouslyBorrowed.length})
        </h2>
        {previouslyBorrowed.length > 0 ? (
          <BorrowHistoryTable records={previouslyBorrowed} />
        ) : (
          <p className="text-gray-500">No borrowing history.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;