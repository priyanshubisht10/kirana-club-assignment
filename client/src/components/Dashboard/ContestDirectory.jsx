import { useState } from 'react';
import Search from '../Common/Search';
import ContestList from '../Common/ContestList';

function ContestDirectory() {
  const [searchQuery, setSearchQuery] = useState('');


  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="space-y-4">

      <div>
        <Search onSearch={handleSearch} />
      </div>

      <div>
        <ContestList query={searchQuery} limit={10} />
      </div>
    </div>
  );
}

export default ContestDirectory;
