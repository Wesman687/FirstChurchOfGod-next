import React, { useState, useEffect, useRef } from 'react';

function PeopleMentionsInput({ peopleMentions, onPeopleMentionsChange }) {
  const [currentMention, setCurrentMention] = useState({ name: '', context: '' });
  const [availableNames, setAvailableNames] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    // Fetch available names for autocomplete
    fetch('/api/people-names')
      .then(res => res.json())
      .then(names => setAvailableNames(names))
      .catch(err => console.error('Error fetching names:', err));
  }, []);

  const handleNameChange = (value) => {
    setCurrentMention({ ...currentMention, name: value });
    
    if (value.length > 0) {
      const filtered = availableNames.filter(name => 
        name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredNames(filtered);
      setShowSuggestions(true);
      setSelectedSuggestionIndex(-1);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < filteredNames.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          selectSuggestion(filteredNames[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const selectSuggestion = (name) => {
    setCurrentMention({ ...currentMention, name });
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const addMention = () => {
    if (currentMention.name.trim()) {
      const newMentions = [...peopleMentions, currentMention];
      onPeopleMentionsChange(newMentions);
      setCurrentMention({ name: '', context: '' });
    }
  };

  const removeMention = (index) => {
    const newMentions = peopleMentions.filter((_, i) => i !== index);
    onPeopleMentionsChange(newMentions);
  };

  return (
    <div className="people-mentions-container">
      <label className="add-image-labels">People in Photo:</label>
      
      {/* Current mentions list */}
      {peopleMentions.length > 0 && (
        <div className="current-mentions">
          {peopleMentions.map((mention, index) => (
            <div key={index} className="mention-tag">
              <span>{mention.name}</span>
              {mention.context && <span className="mention-context"> - {mention.context}</span>}
              <button 
                type="button" 
                className="remove-mention" 
                onClick={() => removeMention(index)}
                aria-label="Remove mention"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new mention form */}
      <div className="add-mention-form">
        <div className="name-input-container">
          <input
            type="text"
            placeholder="Start typing a name..."
            value={currentMention.name}
            onChange={(e) => handleNameChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onFocus={() => {
              if (currentMention.name && filteredNames.length > 0) {
                setShowSuggestions(true);
              }
            }}
            className="name-input"
          />
          
          {/* Autocomplete suggestions */}
          {showSuggestions && filteredNames.length > 0 && (
            <div className="suggestions-list" ref={suggestionsRef}>
              {filteredNames.map((name, index) => (
                <div
                  key={name}
                  className={`suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
                  onClick={() => selectSuggestion(name)}
                >
                  {name}
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Context (optional)"
          value={currentMention.context}
          onChange={(e) => setCurrentMention({ ...currentMention, context: e.target.value })}
          className="context-input"
        />

        <button 
          type="button" 
          onClick={addMention}
          disabled={!currentMention.name.trim()}
          className="add-mention-btn"
        >
          Add Person
        </button>
      </div>
    </div>
  );
}

export default PeopleMentionsInput;
