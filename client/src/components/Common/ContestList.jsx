import { useEffect, useState } from 'react';
import ContestCard from './ContestCard.jsx'; 
import { fetchFirstXContests, searchContestsBySlug } from '../../services/contestService.js'; 

function ContestList({ limit = 5, page = 1, query = "", handleContestListChange={handleContestListChange} }) {
   const [contests, setContests] = useState([]);
   const [currentPage, setCurrentPage] = useState(page);

   const handleNextPage = () => {
      setCurrentPage((prevPage) => prevPage + 1);
   };

   const handlePreviousPage = () => {
      setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
   };

   useEffect(() => {
      const fetchContestsFromDB = async () => {
         try {
            if (query !== "") {
               const filteredContests = await searchContestsBySlug(query);
               setContests(filteredContests.slice(currentPage-1*1, currentPage*1+limit-1));
               handleContestListChange(filteredContests.slice(currentPage-1*1, currentPage*1+limit-1));
               console.log('Fetched filtered contests:', filteredContests); 
            } else {
               const firstXContests = await fetchFirstXContests(currentPage, limit); 
               setContests(firstXContests);
               handleContestListChange(firstXContests);
               console.log('Fetched contests for page:', currentPage, firstXContests); 
            }
         } catch (error) {
            console.error('Error fetching contests from IndexedDB:', error);
         }
      };

      fetchContestsFromDB();

   }, [currentPage, limit, query]); 

   return (
      <div className="space-y-6 p-6 bg-gray-100 rounded-lg shadow-lg">
         <div className="space-y-4">
            {contests.map((contest) => (
               <ContestCard key={contest.id} contest={contest} />
            ))}
         </div>

         <div className="flex justify-between items-center mt-6">
            <button
               onClick={handlePreviousPage}
               disabled={currentPage === 1}
               className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
               Previous
            </button>
            <span className="text-lg text-gray-700">Page {currentPage}</span>
            <button
               onClick={handleNextPage}
               className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
            >
               Next
            </button>
         </div>
      </div>
   );
}

export default ContestList;
