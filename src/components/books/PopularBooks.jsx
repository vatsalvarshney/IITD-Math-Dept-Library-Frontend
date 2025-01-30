import React from 'react';
import { Link } from 'react-router-dom';
import { truncatedText } from '../../lib/utils';

const BookCard = ({ book }) => (
  <Link
    to={`/books/${book.id}`}
    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
  >
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{truncatedText(book.title)}</h3>
      <p className="text-gray-600 text-sm mb-2">by {truncatedText(book.author)}</p>
      <div className="flex justify-between items-center">
        <span className={book.available_quantity>0? "text-sm text-green-600" : "text-sm text-red-700"}>
          Available: {book.available_quantity}
        </span>
        <span>
          {book.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag.id}
              className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded mx-1"
            >
              {tag.name}
            </span>
          ))}
          {book.tags?.length > 2 && (
            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded mx-1">
              +{book.tags.length - 2}
            </span>
          )}
        </span>
      </div>
    </div>
  </Link>
);

const PopularBooks = ({ books }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {books.map((book) => (
      <BookCard key={book.id} book={book} />
    ))}
  </div>
);

export default PopularBooks;