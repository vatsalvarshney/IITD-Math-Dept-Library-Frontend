import axios from './axios';

export const getPopularBooks = () => axios.get('/api/books/popular/');
export const getNewArrivals = () => axios.get('/api/books/new-arrivals/');
export const getTags = () => axios.get('/api/tags/');
export const addTag = (tagData) => axios.post('/api/tags/add/', tagData);
export const getBooks = (params) => axios.get('/api/books/', { params: params });
export const getBookDetails = (bookId) => axios.get(`/api/books/${bookId}/`);
export const getBorrowHistory = (bookId) => axios.get(`/api/books/${bookId}/history/`);
export const addBook = (bookData) => axios.post('/api/books/add/', bookData);
export const updateBook = (bookId, bookData) => axios.put(`/api/books/${bookId}/update/`, bookData);
export const deleteBook = (bookId) => axios.delete(`/api/books/${bookId}/delete/`);
export const getShelves = () => axios.get('/api/books/shelves/');