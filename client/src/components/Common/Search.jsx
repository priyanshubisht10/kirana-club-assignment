import { TextField } from '@shopify/polaris';
import { useState, useCallback } from 'react';

function Search({ onSearch }) {
  const [query, setQuery] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const handleChange = useCallback(
    (newValue) => {
      setQuery(newValue);

      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      const timeout = setTimeout(() => {
        onSearch(newValue);
      }, 500);

      setDebounceTimeout(timeout);
    },
    [debounceTimeout, onSearch]
  );

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <TextField
        label="Search Contests"
        value={query}
        onChange={handleChange}
        autoComplete="off"
        placeholder="Type contest name..."
        className="w-full"
      />
    </div>
  );
}

export default Search;
