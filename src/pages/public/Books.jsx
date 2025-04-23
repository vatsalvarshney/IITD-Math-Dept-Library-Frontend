import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, Filter, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { truncatedText } from '../../lib/utils';
import { getTags, getBooks } from '../../api/books';

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [localQuery, setLocalQuery] = React.useState('');
  const [pagination, setPagination] = React.useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });

  // Get current filter values from URL
  const query = searchParams.get('q') || '';
  const selectedTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
  const availableOnly = searchParams.get('available') === 'true';
  const currentPage = parseInt(searchParams.get('page') || '1');

  // Initialize local query with URL query on mount and when URL query changes
  React.useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  // Fetch tags on mount
  React.useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getTags();
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

  // Memoize tags for dependency tracking
  const memoizedTags = React.useMemo(() => selectedTags.join(','), [selectedTags]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await getBooks({
        q: query,
        tags: memoizedTags,
        available: availableOnly,
        page: currentPage,
        per_page: 10,
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

  // Only fetch books when filters actually change
  React.useEffect(() => {
    fetchBooks();
  }, [query, memoizedTags, availableOnly, currentPage]); 

  // Handle search submission
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    updateFilters({ q: localQuery });
  };

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
    setLocalQuery('');
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
                <label className="flex items-center space-x-2 cursor-pointer">
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
                    <label key={tag._id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag._id.toString())}
                        onChange={() => toggleTag(tag._id.toString())}
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
              <form onSubmit={handleSearchSubmit} className="relative flex">
                <input
                  type="text"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  onBlur={handleSearchSubmit}
                  placeholder="Search books..."
                  className="w-full pl-4 pr-10 py-2 border border-gray-400 rounded-l-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {localQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setLocalQuery('');
                      updateFilters({ q: '' });
                    }}
                    className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="flex items-center justify-center px-4 bg-primary text-white rounded-r-lg hover:bg-primary-dark"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>
            </div>

            {/* Results count */}
            <div className="mb-4 text-gray-600">
              {pagination.totalCount} {pagination.totalCount === 1 ? "book" : "books"} found
            </div>

            {/* Books list */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : books.length > 0 ? (
                <div className="divide-y-2">
                  {books.map((book) => (
                    <Link to={`/books/${book.id}`} key={book.id} className="p-4 hover:bg-gray-50 block border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg mb-1">{truncatedText(book.title)}</h3>
                          <p className="text-gray-600">by {truncatedText(book.author)}</p>
                          
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
                      <div className="mt-2 flex justify-between items-center">
                        <span className='flex flex-wrap gap-2'>
                          {book.tags?.slice(0, 2).map((tag) => (
                            <span
                              key={tag.id}
                              className="px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded"
                            >
                              {tag.name}
                            </span>
                          ))}
                          {book.tags?.length > 2 && (
                            <span className="px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded">
                              +{book.tags.length - 2}
                            </span>
                          )}
                        </span>
                        <span className="text-sm text-gray-500 text-right">
                          Shelf {book.shelf || '?'} | Rack {book.rack || '?'}
                        </span>
                      </div>
                    </Link>
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