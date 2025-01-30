// import React from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { searchBooks, getTags } from '../../api/books';
// import SearchBar from '../../components/common/SearchBar';
// import BookFilters from '../../components/books/BookFilters';
// import PopularBooks from '../../components/books/PopularBooks';
// import { useEffect, useState } from 'react';

// const Books = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [books, setBooks] = useState([]);
//   const [tags, setTags] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [showAvailableOnly, setShowAvailableOnly] = useState(false);

//   // Get current search query from URL
//   const query = searchParams.get('q') || '';

//   useEffect(() => {
//     // Fetch tags when component mounts
//     const loadTags = async () => {
//       try {
//         const response = await getTags();
//         setTags(response.data);
//       } catch (error) {
//         console.error('Error fetching tags:', error);
//       }
//     };
//     loadTags();
//   }, []);

//   useEffect(() => {
//     const fetchBooks = async () => {
//       setLoading(true);
//       try {
//         const params = {
//           q: query,
//           tags: selectedTags.join(','),
//           available: showAvailableOnly ? '1' : ''
//         };
//         const response = await searchBooks(params);
//         setBooks(response.data);
//       } catch (error) {
//         console.error('Error searching books:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, [query, selectedTags, showAvailableOnly]);

//   const handleSearch = (newQuery) => {
//     setSearchParams({ q: newQuery });
//   };

//   const handleTagToggle = (tagId) => {
//     setSelectedTags(prev =>
//       prev.includes(tagId)
//         ? prev.filter(id => id !== tagId)
//         : [...prev, tagId]
//     );
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="flex justify-center mb-8">
//         <SearchBar onSearch={handleSearch} initialValue={query} />
//       </div>

//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Filters sidebar */}
//         <div className="md:w-64 flex-shrink-0">
//           <BookFilters
//             tags={tags}
//             selectedTags={selectedTags}
//             onTagToggle={handleTagToggle}
//             showAvailableOnly={showAvailableOnly}
//             onAvailableToggle={() => setShowAvailableOnly(prev => !prev)}
//           />
//         </div>

//         {/* Results */}
//         <div className="flex-1">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-bold text-gray-900">
//               {query ? `Search Results for "${query}"` : 'All Books'}
//             </h2>
//             <span className="text-gray-600">
//               {books.length} {books.length === 1 ? 'book' : 'books'} found
//             </span>
//           </div>

//           {loading ? (
//             <div className="flex justify-center py-8">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
//             </div>
//           ) : books.length > 0 ? (
//             <PopularBooks books={books} />
//           ) : (
//             <div className="text-center py-8">
//               <p className="text-gray-600">No books found matching your criteria.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Books;




// import React, { useState, useEffect, useMemo } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { Search, X, Filter } from 'lucide-react';
// import axios from '../../api/axios';

// const Books = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [books, setBooks] = useState([]);
//   const [tags, setTags] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPages, setTotalPages] = useState(0);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   const query = searchParams.get('q') || '';
//   const selectedTags = searchParams.get('tags')?.split(',') || [];
//   const availableOnly = searchParams.get('available') === 'true';
//   const currentPage = parseInt(searchParams.get('page') || '1');

//   useEffect(() => {
//     const fetchTags = async () => {
//       try {
//         const response = await axios.get('/api/tags/');
//         setTags(response.data);
//       } catch (error) {
//         console.error('Error fetching tags:', error);
//       }
//     };
//     fetchTags();
//   }, []);

//   const memoizedFilters = useMemo(() => ({ query, selectedTags, availableOnly, currentPage }), [searchParams]);

//   useEffect(() => {
//     const fetchBooks = async () => {
//       setLoading(true);
//       try {
//         const params = new URLSearchParams({
//           page: memoizedFilters.currentPage.toString(),
//           ...(memoizedFilters.query && { q: memoizedFilters.query }),
//           ...(memoizedFilters.selectedTags.length && { tags: memoizedFilters.selectedTags.join(',') }),
//           ...(memoizedFilters.availableOnly && { available: 'true' }),
//         });

//         const response = await axios.get(`/api/books/?${params}`);
//         setBooks(response.data.results);
//         setTotalPages(Math.ceil(response.data.count / 3));
//       } catch (error) {
//         console.error('Error fetching books:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, [memoizedFilters]);

//   const updateFilters = (updates) => {
//     const newParams = new URLSearchParams(searchParams);
//     Object.entries(updates).forEach(([key, value]) => {
//       if (value) {
//         newParams.set(key, value);
//       } else {
//         newParams.delete(key);
//       }
//     });
//     if (!updates.hasOwnProperty('page')) {
//       newParams.set('page', '1');
//     }
//     setSearchParams(newParams);
//   };

//   const handlePageChange = (newPage) => {
//     updateFilters({ page: newPage.toString() });
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Search Bar */}
//       <div className="mb-4 flex items-center gap-4">
//         <div className="relative w-full">
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => updateFilters({ q: e.target.value })}
//             placeholder="Search books..."
//             className="w-full px-4 py-3 pl-12 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
//           />
//           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//           {query && (
//             <button onClick={() => updateFilters({ q: '' })} className="absolute right-4 top-1/2 transform -translate-y-1/2">
//               <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//             </button>
//           )}
//         </div>
//         <button className="md:hidden p-2 border rounded-lg" onClick={() => setIsFilterOpen(!isFilterOpen)}>
//           <Filter className="h-5 w-5" />
//         </button>
//       </div>

//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Filters Sidebar (Collapsible on Mobile) */}
//         <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block w-full md:w-64 space-y-4 bg-white p-4 rounded-lg shadow-sm md:shadow-none md:p-0`}>
//           <div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">Availability</h3>
//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={availableOnly}
//                 onChange={(e) => updateFilters({ available: e.target.checked ? 'true' : '' })}
//                 className="rounded border-gray-300"
//               />
//               <span className="ml-2">Available books only</span>
//             </label>
//           </div>
//           <div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">Tags</h3>
//             <div className="space-y-1">
//               {tags.map((tag) => (
//                 <label key={tag.id} className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={selectedTags.includes(tag.id.toString())}
//                     onChange={() => updateFilters({ tags: selectedTags.includes(tag.id.toString()) ? selectedTags.filter(id => id !== tag.id.toString()).join(',') : [...selectedTags, tag.id.toString()].join(',') })}
//                     className="rounded border-gray-300"
//                   />
//                   <span className="ml-2">{tag.name}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Books List */}
//         <div className="flex-1 space-y-4">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-bold text-gray-900">
//               {query ? `Search Results for "${query}"` : 'All Books'}
//             </h2>
//           </div>
//           {loading ? (
//             <div className="flex justify-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
//             </div>
//           ) : (
//             books.map((book) => (
//               <div key={book.id} className="bg-white p-4 rounded-lg shadow-sm">
//                 <h3 className="text-lg font-semibold">{book.title}</h3>
//                 <p className="text-gray-600">by {book.author}</p>
//                 <p className={`${book.available_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>Available: {book.available_quantity} / {book.total_quantity}</p>
//               </div>
//             ))
//           )}

//           {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-center mt-8 gap-2">
//                 <button
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="px-4 py-2 border rounded-md text-primary hover:bg-primary-light hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   ❮
//                 </button>
//                 {[...Array(totalPages)].map((_, i) => (
//                   <button
//                     key={i + 1}
//                     onClick={() => handlePageChange(i + 1)}
//                     className={`px-4 py-2 border rounded-md ${
//                       currentPage === i + 1
//                         ? 'bg-primary text-white'
//                         : 'text-primary hover:bg-primary-light hover:text-white cursor-pointer'
//                     }`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//                 <button
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="px-4 py-2 border rounded-md text-primary hover:bg-primary-light hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   ❯
//                 </button>
//               </div>
//             )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Books;






// import React from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import { Search, X } from 'lucide-react';
// import axios from '../../api/axios';

// const Books = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const navigate = useNavigate();
  
//   const [books, setBooks] = React.useState([]);
//   const [tags, setTags] = React.useState([]);
//   const [loading, setLoading] = React.useState(true);
//   const [totalPages, setTotalPages] = React.useState(0);
  
//   // Get current filter values from URL
//   const query = searchParams.get('q') || '';
//   const selectedTags = searchParams.get('tags')?.split(',') || [];
//   const availableOnly = searchParams.get('available') === 'true';
//   const currentPage = parseInt(searchParams.get('page') || '1');

//   // Fetch tags on component mount
//   React.useEffect(() => {
//     const fetchTags = async () => {
//       try {
//         const response = await axios.get('/api/tags/');
//         setTags(response.data);
//       } catch (error) {
//         console.error('Error fetching tags:', error);
//       }
//     };
//     fetchTags();
//   }, []);

//   const memoizedFilters = React.useMemo(() => ({
//     query: searchParams.get('q') || '',
//     selectedTags: searchParams.get('tags')?.split(',') || [],
//     availableOnly: searchParams.get('available') === 'true',
//     currentPage: parseInt(searchParams.get('page') || '1'),
//   }), [searchParams]);
  
//   // Fetch books when filters change
//   React.useEffect(() => {
//     const fetchBooks = async () => {
//       setLoading(true);
//       try {
//         const params = new URLSearchParams({
//           page: memoizedFilters.currentPage.toString(),
//           ...(memoizedFilters.query && { q: memoizedFilters.query }),
//           ...(memoizedFilters.selectedTags.length && { tags: memoizedFilters.selectedTags.join(',') }),
//           ...(memoizedFilters.availableOnly && { available: 'true' }),
//         });
  
//         const response = await axios.get(`/api/books/?${params}`);
//         setBooks(response.data.results);
//         setTotalPages(Math.ceil(response.data.count / 10));
//       } catch (error) {
//         console.error('Error fetching books:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchBooks();
//   }, [memoizedFilters]);
  

//   // Update URL params and trigger search
//   const updateFilters = (updates) => {
//     const newParams = new URLSearchParams(searchParams);
    
//     Object.entries(updates).forEach(([key, value]) => {
//       if (value) {
//         newParams.set(key, value);
//       } else {
//         newParams.delete(key);
//       }
//     });
    
//     // Reset to first page when filters change
//     if (!updates.hasOwnProperty('page')) {
//       newParams.set('page', '1');
//     }
    
//     setSearchParams(newParams);
//   };

//   const handleSearch = (searchQuery) => {
//     updateFilters({ q: searchQuery });
//   };

//   const handleTagToggle = (tagId) => {
//     const newTags = selectedTags.includes(tagId)
//       ? selectedTags.filter(id => id !== tagId)
//       : [...selectedTags, tagId];
//     updateFilters({ tags: newTags.join(',') });
//   };

//   const clearSearch = () => {
//     setSearchParams(new URLSearchParams());
//   };

//   const handlePageChange = (newPage) => {
//     updateFilters({ page: newPage.toString() });
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Search Bar */}
//       <div className="mb-8">
//         <div className="relative">
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => handleSearch(e.target.value)}
//             placeholder="Search books by title, author, or ISBN..."
//             className="w-full px-4 py-3 pl-12 bg-white text-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//           />
//           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//           {query && (
//             <button
//               onClick={clearSearch}
//               className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Filters Sidebar */}
//         <div className="w-full md:w-64 space-y-6">
//           {/* Availability Filter */}
//           <div>
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Availability</h3>
//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={availableOnly}
//                 onChange={(e) => updateFilters({ available: e.target.checked ? 'true' : '' })}
//                 className="rounded border-gray-300 text-primary focus:ring-primary"
//               />
//               <span className="ml-2 text-gray-700">Available books only</span>
//             </label>
//           </div>

//           {/* Tags Filter */}
//           <div>
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
//             <div className="space-y-2">
//               {tags.map((tag) => (
//                 <label key={tag.id} className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={selectedTags.includes(tag.id.toString())}
//                     onChange={() => handleTagToggle(tag.id.toString())}
//                     className="rounded border-gray-300 text-primary focus:ring-primary"
//                   />
//                   <span className="ml-2 text-gray-700">{tag.name}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//         </div>

//         {/* Results */}
//         <div className="flex-1">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-bold text-gray-900">
//               {query ? `Search Results for "${query}"` : 'All Books'}
//             </h2>
//             {/* <span className="text-gray-600">
//               {books.length} {books.length === 1 ? 'book' : 'books'} found
//             </span> */}
//           </div>

//           {loading ? (
//             <div className="flex justify-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {books.map((book) => (
//                 <div
//                   key={book.id}
//                   className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
//                 >
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
//                       <p className="text-gray-600 mt-1">by {book.author}</p>
//                       {/* <p className="text-gray-500 text-sm mt-2">ISBN: {book.isbn}</p> */}
//                       <div className="flex gap-2 mt-2">
//                         {book.tags.map((tag) => (
//                           <span
//                             key={tag.id}
//                             className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
//                           >
//                             {tag.name}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className={book.available_quantity>0? "text-sm text-gray-500 text-green-600" : "text-sm text-gray-500 text-red-700"}>
//                         Available: {book.available_quantity} / {book.total_quantity}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className="flex justify-center mt-8 gap-2">
//                   <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="px-4 py-2 border rounded-md text-primary hover:bg-primary-light hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     ❮
//                   </button>
//                   {[...Array(totalPages)].map((_, i) => (
//                     <button
//                       key={i + 1}
//                       onClick={() => handlePageChange(i + 1)}
//                       className={`px-4 py-2 border rounded-md ${
//                         currentPage === i + 1
//                           ? 'bg-primary text-white'
//                           : 'text-primary hover:bg-primary-light hover:text-white cursor-pointer'
//                       }`}
//                     >
//                       {i + 1}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="px-4 py-2 border rounded-md text-primary hover:bg-primary-light hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     ❯
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Books;




import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, Filter, ChevronRight } from 'lucide-react';
import axios from '../../api/axios';

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });

  // Get current filter values from URL
  const query = searchParams.get('q') || '';
  // const [query, setQuery] = React.useState(searchParams.get('q') || '');
  const selectedTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
  const availableOnly = searchParams.get('available') === 'true';
  const currentPage = parseInt(searchParams.get('page') || '1');

  // Fetch tags on mount
  React.useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('/api/tags/');
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

  // Fetch books when filters change
  const memoizedTags = React.useMemo(() => selectedTags.join(','), [selectedTags]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/books/', {
        params: {
          q: query,
          tags: memoizedTags,
          available: availableOnly,
          page: currentPage,
          per_page: 10,
        },
      });
      setBooks(response.data.results);
      setPagination({
        currentPage: response.data.current_page,
        totalPages: response.data.total_pages,
        totalCount: response.data.total_count,
      });
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBooks();
  // }, [memoizedTags, availableOnly, currentPage]); // Only re-run when these change
  }, [query, memoizedTags, availableOnly, currentPage]); // Only re-run when these change

  // Update filters
  const updateFilters = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    // Reset to first page when filters change
    if (!updates.hasOwnProperty('page')) {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchParams({});
  };

  // Toggle tag selection
  const toggleTag = (tagId) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    updateFilters({ tags: newTags.join(',') });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile filter button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            <ChevronRight className={`h-5 w-5 transform transition-transform ${isFilterOpen ? 'rotate-90' : ''}`} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <div className={`lg:w-64 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                {(query || selectedTags.length > 0 || availableOnly) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Availability filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Availability</h3>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => updateFilters({ available: e.target.checked })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span>Show available only</span>
                </label>
              </div>

              {/* Tags filter */}
              <div>
                <h3 className="font-medium mb-2">Tags</h3>
                <div className="space-y-2">
                  {tags.map((tag) => (
                    <label key={tag.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag.id.toString())}
                        onChange={() => toggleTag(tag.id.toString())}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span>{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* Search bar */}
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => updateFilters({ q: e.target.value })}
                  placeholder="Search books..."
                  className="w-full pl-4 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {query && (
                  <button
                    onClick={() => updateFilters({ q: '' })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Results count */}
            <div className="mb-4 text-gray-600">
              {pagination.totalCount} {pagination.totalCount==1? "book" : "books"} found
            </div>

            {/* Books list */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : books.length > 0 ? (
                <div className="divide-y">
                  {books.map((book) => (
                    <div key={book.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg mb-1">{book.title}</h3>
                          <p className="text-gray-600">by {book.author}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {book.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`font-medium ${book.available_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {book.available_quantity} available
                          </span>
                          <p className="text-sm text-gray-500">
                            Total: {book.total_quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No books found
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => updateFilters({ page: currentPage - 1 })}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => updateFilters({ page: currentPage + 1 })}
                    disabled={currentPage === pagination.totalPages}
                    className="px-3 py-1 rounded border disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Books;