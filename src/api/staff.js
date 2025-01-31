import axios from './axios';

export const getDashboardStats = () => axios.get('/api/staff/dashboard/stats/');
export const getStaffBooks = () => axios.get('/api/staff/books/');
export const issueBook = (data) => axios.post('/api/staff/books/issue/', data);
export const returnBook = (borrowId) => axios.post(`/api/staff/books/return/${borrowId}/`);