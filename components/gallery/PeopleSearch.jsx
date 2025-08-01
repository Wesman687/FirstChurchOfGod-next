import React, { useState, useEffect } from 'react';

function PeopleSearch({ onSearchResults, onClearSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [availableNames, setAvailableNames] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Fetch available names for search suggestions
    fetch('/api/people-names')
      .then(res => res.json())
      .then(names => setAvailableNames(names))
      .catch(err => console.error('Error fetching names:', err));
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      onClearSearch();
      return;
    }

    setIsSearching(true);
    try {
      // Search for all images that contain mentions of this person
      const response = await fetch(`/api/image-people-mentions?search=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const mentions = await response.json();
        const imageUrls = mentions.map(mention => mention.media_url);
        onSearchResults(imageUrls, searchQuery);
      }
    } catch (error) {
      console.error('Error searching for people:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    onClearSearch();
  };

  const filteredSuggestions = availableNames.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="people-search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search by person name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="people-search-input"
        />
        
        <div className="search-buttons">
          <button 
            onClick={handleSearch}
            disabled={isSearching}
            className="search-btn"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
          
          {searchQuery && (
            <button onClick={handleClear} className="clear-btn">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Search suggestions */}
      {searchQuery && filteredSuggestions.length > 0 && (
        <div className="search-suggestions">
          {filteredSuggestions.map((name, index) => (
            <div
              key={index}
              className="search-suggestion"
              onClick={() => {
                setSearchQuery(name);
                setTimeout(handleSearch, 100);
              }}
            >
              {name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PeopleSearch;
