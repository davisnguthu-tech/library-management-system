import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function BookDetail() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await axios.get(`${API_URL}/books/${id}`);
        setBook(response.data);
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('Unable to load book details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return <p className="status-message">Loading book details...</p>;
  }

  if (error) {
    return (
      <div className="detail-container">
        <p className="error-message">{error}</p>
        <Link to="/">Back to Catalogue</Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="detail-container">
        <p>Book not found.</p>
        <Link to="/">Back to Catalogue</Link>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <Link to="/" className="back-link">
        ← Back to Catalogue
      </Link>

      <article className="book-detail-card">
        <span className="book-genre">
          {book.genre?.name || 'Uncategorized'}
        </span>

        <h1>{book.title}</h1>

        <h3>By {book.author}</h3>

        <p className="detail-description">
          {book.description || 'No description available.'}
        </p>

        <div className="book-information">
          <p><strong>ISBN:</strong> {book.isbn || 'Not available'}</p>
          <p><strong>Available Copies:</strong> {book.totalCopies}</p>
          <p>
            <strong>Published:</strong>{' '}
            {book.published ? 'Yes' : 'No'}
          </p>
        </div>
      </article>
    </div>
  );
}

export default BookDetail;