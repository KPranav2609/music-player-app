import React from "react";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import "../../css/search/SearchBar.css";

const SearchBar = ({ setSearchSongs }) => {
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!query.trim()) {
      setSearchSongs([]);
      return;
    }

    const fetchSongs = async () => {
      try { 
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/songs/playlistBytag/${encodeURIComponent(
            query
          )}`
        );
        setSearchSongs(res.data.results || []);
      } catch (error) {
        console.error("Error fetching search songs:", error);
        setSearchSongs([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchSongs, 400);

    return () => clearTimeout(debounce);
  }, [query, setSearchSongs]);

  return (
    <div className="searchbar-root">
      <div className="searchbar-input-wrapper">
        <input
          className="searchbar-input"
          type="text"
          placeholder="Search songs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <CiSearch size={20} className="searchbar-icon" />
      </div>

      {!query && !loading && (
        <p className="searchbar-empty">Search Songs to Display</p>
      )}

      {loading && <p className="searchbar-loading">Searching...</p>}
    </div>
  );
};

export default SearchBar;