import axios from './axios';

export const exportBooks = () => {
  return axios.get('/api/export/books/', {
    responseType: 'blob',
  });
};

export const exportDetailed = () => {
  return axios.get('/api/export/books/detailed/', {
    responseType: 'blob',
  });
};