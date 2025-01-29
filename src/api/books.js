import axios from './axios';

export const getPopularBooks = () => axios.get('/api/books/popular/');
export const getNewArrivals = () => axios.get('/api/books/new-arrivals/');