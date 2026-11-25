import { useState } from 'react';
import BookGrid from '../components/BookGrid';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('');

  return (
    <div className="app-container">
      <header className="site-header">
        <h1>My Library</h1>
        <p>Discover your next great read.</p>
      </header>

      <main className="main-content">
        <section className="catalogue-heading">
          <h2>Explore Our Collection</h2>
          <p>
            Browse books, search by title or author, filter by genre,
            or sort your collection.
          </p>
        </section>

        <section className="catalogue-controls">
          <SearchBar onSearch={setSearchTerm} />

          <GenreFilter
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
          />

          <div className="sort-filter">
            <label htmlFor="sort-select">Sort by:</label>

            <select
              id="sort-select"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="">Default order</option>
              <option value="title-asc">Title (A–Z)</option>
              <option value="title-desc">Title (Z–A)</option>
              <option value="author-asc">Author (A–Z)</option>
              <option value="author-desc">Author (Z–A)</option>
            </select>
          </div>
        </section>

        <BookGrid
          genreId={selectedGenre}
          searchTerm={searchTerm}
          sortBy={sortBy}
        />
      </main>
    </div>
  );
}

export default HomePage;