import { useState, useEffect, useRef } from "react";

export default function PlaceSearch({ placeholder, onSelectPlace }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimer = useRef(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const searchPlaces = async (searchQuery) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          searchQuery
        )}&format=json&apiKey=${apiKey}`
      );

      const data = await response.json();

      if (data.results) {
        setSuggestions(
          data.results.map((result) => ({
            name: result.name || result.formatted,
            address: result.formatted,
            lat: result.lat,
            lon: result.lon,
            placeId: result.place_id,
          }))
        );
        setShowDropdown(true);
      }
    } catch (error) {
      console.error("Error searching places:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce search
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      searchPlaces(value);
    }, 300);
  };

  const handleSelectSuggestion = (place) => {
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
    onSelectPlace(place);
  };

  return (
    <div className="place-search">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder || "Search for a place..."}
        className="place-search-input"
      />

      {isLoading && <div className="loading-indicator">Searching...</div>}

      {showDropdown && suggestions.length > 0 && (
        <ul className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="suggestion-item"
            >
              <div className="suggestion-name">{suggestion.name}</div>
              <div className="suggestion-address">{suggestion.address}</div>
            </li>
          ))}
        </ul>
      )}

      {showDropdown && suggestions.length === 0 && query.length >= 3 && !isLoading && (
        <div className="no-results">No places found</div>
      )}
    </div>
  );
}