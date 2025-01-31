import axios from './axios';

export const getUserProfile = (username) => axios.get(`/api/users/${username}/profile/`);

export const getUserBorrowHistory = (username) => axios.get(`/api/users/${username}/borrow-history/`);

export const getAllStudents = () => axios.get('/api/users/students/');