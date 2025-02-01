import React from 'react';
import { X } from 'lucide-react';
import { getAllStudents } from '../../api/users';
import Select from "react-select";
import { kerberosToEntryNumber, entryNumberToKerberos } from '../../lib/utils';

const IssueBookModal = ({ book, onClose, onIssue }) => {
  const [student, setStudent] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onIssue({ book_id: book.id, student: entryNumberToKerberos(student) });
      onClose();
    } catch (error) {
      console.error('Error issuing book:', error);
    } finally {
      setLoading(false);
    }
  };

  const [students, setStudents] = React.useState([]);
  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getAllStudents();
        setStudents(res.data.map((s) => ({
          value: kerberosToEntryNumber(s.username),
          label: `${s.first_name} ${s.last_name} (${kerberosToEntryNumber(s.username)})`
        })));
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Issue Book</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Book:</span> {book.title}
            </p>
            <p className="text-gray-600 mb-4">
              <span className="font-medium">Available:</span> {book.available_quantity}
            </p>
            
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student
            </label>
            <Select
              options={students}
              value={students.find((s) => s.value === student)}
              onChange={(selected) => setStudent(selected.value)}
              className="w-full"
              placeholder="Search by Name or Entry Number..."
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !student}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? 'Issuing...' : 'Issue Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueBookModal;