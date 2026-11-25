import { Link } from 'react-router-dom';

function BookCard({ book }) {
  return (
    <div className="book-card">
      <div className="book-card-content">
        <span className="book-genre">
          {book.genre?.name || 'Uncategorized'}
        </span>

        <h3>{book.title}</h3>

        <p className="book-author">By {book.author}</p>

        <p className="book-description">
          {book.description || 'No description available.'}
        </p>

        <div className="book-card-footer">
          <span className="book-copies">
            {book.totalCopies} copies
          </span>

          <Link to={`/books/${book.id}`} className="details-link">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookCard;