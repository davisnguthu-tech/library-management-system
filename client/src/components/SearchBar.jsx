import { useEffect, useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, onSearch]);

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search by book title or author..."
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        className="search-input"
      />
    </div>
  );
}

export default SearchBar;