import React, { useState, useEffect } from "react";
import "./SearchBar.css";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ placeholder = "Search products...", onSearch }) => {
  const [query, setQuery] = useState("");

  // Debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch && onSearch(query.trim());
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query, onSearch]);

  const handleSearchClick = () => {
    onSearch && onSearch(query.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <button
        type="button"
        className="search-btn"
        onClick={handleSearchClick}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
