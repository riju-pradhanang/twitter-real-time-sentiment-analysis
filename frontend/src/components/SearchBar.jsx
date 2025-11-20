import React, { useState } from 'react';

const SearchBar = ({ onSearch, onScrape, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleScrape = () => {
    if (searchTerm.trim()) {
      onScrape(searchTerm.trim());
    }
  };

  const handleSuggestionClick = (term) => {
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <div className="glass-card search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter search term (e.g., javascript, react, ai)..."
          className="search-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="search-button"
          disabled={loading || !searchTerm.trim()}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button 
          type="button" 
          className="scrape-button"
          onClick={handleScrape}
          disabled={loading || !searchTerm.trim()}
        >
          {loading ? 'Scraping...' : 'Scrape New'}
        </button>
      </form>
      
      <div className="suggestions" style={{marginTop: '15px', textAlign: 'center'}}>
        <p style={{fontSize: '0.9rem', opacity: '0.7', marginBottom: '8px'}}>Try:</p>
        <div style={{display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap'}}>
          {['javascript', 'react', 'python', 'ai', 'machine learning'].map((term) => (
            <span
              key={term}
              onClick={() => handleSuggestionClick(term)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            >
              {term}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;