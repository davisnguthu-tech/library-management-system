import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function GenreFilter({ selectedGenre, onGenreChange }) {
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${API_URL}/genres`);
        setGenres(response.data);
      } catch (err) {
        console.error('Error fetching genres:', err);
        setError('Unable to load genres.');
      }
    };

    fetchGenres();
  }, []);

  return (
    <div className="genre-filter">
      <label htmlFor="genre-select">Filter by genre:</label>

      <select
        id="genre-select"
        value={selectedGenre}
        onChange={(event) => onGenreChange(event.target.value)}
      >
        <option value="">All Genres</option>

        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default GenreFilter;