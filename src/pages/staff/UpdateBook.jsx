import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookDetails, updateBook } from '../../api/books';
import BookForm from '../../components/staff/BookForm';

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState([]);

  React.useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await getBookDetails(id);
        response.data.tags = response.data.tags.map((tag) => tag._id);
        setBook(response.data);
      } catch (err) {
        setErrors(Object.entries(err.response?.data).map(
          (error) => error[1].join(', '), // Join error messages
        ) || ['Failed to fetch book']);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleSubmit = async (bookData) => {
    setIsSubmitting(true);
    setErrors([]);
    try {
      await updateBook(id, bookData);
      navigate(`/books/${id}`);
    } catch (err) {
      console.error(err);
      // setErrors(Object.entries(err.response?.data).map(
      //   (error) => error[1].join(', '), // Join error messages
      // ) || ['Failed to update book']);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="max-w-4xl mx-auto px-4 py-8">
  //       <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Update Book: {book?.title}
        </h1>
        {errors.map((error, index) => (
          <div key={index} className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        ))}
        <BookForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          initialData={book}
        />
      </div>
    </div>
  );
};

export default UpdateBook;