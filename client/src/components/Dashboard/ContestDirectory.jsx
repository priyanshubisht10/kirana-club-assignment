import { useState, useCallback } from 'react';
import { Select, TextField } from '@shopify/polaris'; // Import Select component from Polaris
import Search from '../Common/Search';
import ContestList from '../Common/ContestList';

function ContestDirectory({ handleContestListChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState(''); // State for filter value
  const [pageLimit, setPageLimit] = useState(10);


  const handleChange = useCallback(
    (newValue) => setPageLimit(newValue),
    [],
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (value) => {
    setFilterValue(value); // Update filter value on dropdown selection
  };

  // Options for the filter dropdown
  const filterOptions = [
    { label: 'All', value: '' },
    { label: 'IOI', value: 'IOI' },
    { label: 'CF', value: 'CF' },
    { label: 'ICPC', value: 'ICPC' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <div className="w-4/5"> {/* 80% width for the search bar */}
          <Search onSearch={handleSearch} />
        </div>

        <div className="w-1/5 m-1" > {/* 20% width for the filter dropdown */}
          <Select
            label="Filter by Contest Type"
            options={filterOptions}
            value={filterValue}
            onChange={handleFilterChange} // Handle filter change
          />
          <TextField
            value={pageLimit}
            onChange={handleChange}
            autoComplete="off"
            placeholder='No. of items per page'
          />

        </div>
      </div>

      <div>
        <ContestList
          query={searchQuery}
          limit={pageLimit}
          handleContestListChange={handleContestListChange}
          filter={filterValue} // Pass filter value to ContestList
        />
      </div>
    </div>
  );
}

export default ContestDirectory;
