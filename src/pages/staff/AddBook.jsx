import React from 'react';
import { useNavigate } from 'react-router-dom';
import { addBook, getTags } from '../../api/books';
import BookForm from '../../components/staff/BookForm';

const AddBook = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState([]);

  const handleSubmit = async (bookData) => {
    setIsSubmitting(true);
    setErrors([]);
    try {
      await addBook(bookData);
      navigate('/staff');
    } catch (err) {
      // setErrors(Object.entries(err.response?.data).map(
      //   (error) => error[1].join(', '), // Join error messages
      // ) || ['Failed to add book']);
      // setError(err.response?.data?.message || 'Failed to add book');

      try {
        setErrors(Object.entries(err.response?.data?.errors).map(
          (error) => error[1].msg
        ) || ['Failed to update book']);
      } catch {
        setErrors([err.response?.data?.error] || ['Failed to update book']);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Book</h1>
        {/* {errors && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
            {errors}
          </div>
        )} */}
        {errors.map((error, index) => (
          <div key={index} className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        ))}
        <BookForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default AddBook;