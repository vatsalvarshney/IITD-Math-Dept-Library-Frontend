import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { getPopularBooks, getNewArrivals } from '../../api/books';
import SearchBar from '../../components/common/SearchBar';
import PopularBooks from '../../components/books/PopularBooks';

const Landing = () => {
  const [popularBooks, setPopularBooks] = React.useState([]);
  const [newArrivals, setNewArrivals] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [popularRes, newArrivalsRes] = await Promise.all([
          getPopularBooks(),
          getNewArrivals()
        ]);
        setPopularBooks(popularRes.data);
        setNewArrivals(newArrivalsRes.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = (query) => {
    navigate(`/books?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/library-bg.jpg')",
            opacity: "0.4"
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Welcome to Mathematics Department Library
          </h1>
          <h5 className="text-xl text-gray-200 mb-8">
            Indian Institute of Technology Delhi
          </h5>
          <a
            href="https://maps.app.goo.gl/jTtGBGyyLXaxxB1i6"
            className="flex items-center gap-2 text-lg text-gray-200 mb-8 max-w-2xl hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPin className="w-5 h-5" />
            Room no. 534, Wing C, 5th Floor, Academic Complex West (99B)
          </a>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Popular Books Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Books</h2>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : (
            <PopularBooks books={popularBooks} />
          )}
        </section>

        {/* New Arrivals Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">New Arrivals</h2>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : (
            <PopularBooks books={newArrivals} />
          )}
        </section>
      </div>
    </div>
  );
};

export default Landing;