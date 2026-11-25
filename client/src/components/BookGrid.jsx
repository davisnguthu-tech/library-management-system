import { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from './BookCard';

const API_URL = import.meta.env.VITE_API_URL;

function BookGrid({ genreId, searchTerm, sortBy }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await axios.get(`${API_URL}/books`, {
          params: {
            genreId: genreId || undefined,
            search: searchTerm || undefined,
            limit: 20,
          },
        });

        setBooks(response.data.data);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Unable to load books. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [genreId, searchTerm]);

  if (loading) {
    return <p className="status-message">Loading books...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (books.length === 0) {
    return (
      <p className="status-message">
        No books found. Try another search or genre.
      </p>
    );
  }

  const sortedBooks = [...books].sort((a, b) => {
    switch (sortBy) {
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'author-asc':
        return a.author.localeCompare(b.author);
      case 'author-desc':
        return b.author.localeCompare(a.author);
      default:
        return 0;
    }
  });

  return (
    <div className="book-grid">
      {sortedBooks.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

export default BookGrid;