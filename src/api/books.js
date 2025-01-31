import axios from './axios';

export const getPopularBooks = () => axios.get('/api/books/popular/');
export const getNewArrivals = () => axios.get('/api/books/new-arrivals/');
export const getBookDetails = (bookId) => axios.get(`/api/books/${bookId}/`);
export const getBorrowHistory = (bookId) => axios.get(`/api/books/${bookId}/history/`);
export const deleteBook = (bookId) => axios.delete(`/api/books/${bookId}/delete/`);