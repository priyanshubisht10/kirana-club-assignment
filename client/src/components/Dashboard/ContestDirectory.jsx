import { useState, useCallback } from 'react';
import { Select, TextField, Checkbox } from '@shopify/polaris'; // Import Select component from Polaris
import Search from '../Common/Search';
import ContestList from '../Common/ContestList';

function ContestDirectory({ handleContestListChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState(''); 
  const [pageLimit, setPageLimit] = useState(10);
  const [showOnlyFav, setShowOnlyFav] = useState(false);

  const handleChange = useCallback(
    (newValue) => setPageLimit(newValue),
    [],
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilterValue(""); 
    setShowOnlyFav(false); 
  };

  const handleFilterChange = (value) => {
    setSearchQuery(""); 
    setFilterValue(value); 
    setShowOnlyFav(false); 
  };

  const handleFavoriate = (newChecked) => {
    setSearchQuery(""); 
    setFilterValue(""); 
    setShowOnlyFav(newChecked); 
  };

  const filterOptions = [
    { label: 'All', value: '' },
    { label: 'IOI', value: 'IOI' },
    { label: 'CF', value: 'CF' },
    { label: 'ICPC', value: 'ICPC' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex space-x-6 items-center">
        <div className="w-3/5"> 
          <Search onSearch={handleSearch} />
        </div>

        <div className="w-1/10"> 
          <Select
            label="Filter by Contest Type"
            options={filterOptions}
            value={filterValue}
            onChange={handleFilterChange} // Handle filter change
            className="mb-0" 
          />
        </div>

        <div className="w-1/10">
          <Checkbox
            label="Show only favorites"
            checked={showOnlyFav}
            onChange={handleFavoriate}
            className="mb-0" 
          />
        </div>

        <div className="w-1/10"> 
          <TextField
            value={pageLimit}
            onChange={handleChange}
            autoComplete="off"
            placeholder="Items per page"
            type="number" // Ensure numeric input
            className="mb-0" // Remove margin for neatness
          />
        </div>
      </div>

      <div>
        <ContestList
          query={searchQuery}
          limit={pageLimit}
          handleContestListChange={handleContestListChange}
          filter={filterValue}
          isFav={showOnlyFav}
        />
      </div>
    </div>
  );
}

export default ContestDirectory;
