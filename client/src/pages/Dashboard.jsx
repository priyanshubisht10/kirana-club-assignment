import PieChart from '../components/Dashboard/PieChart';
import BarChart from '../components/Dashboard/BarChart';
import ContestDirectory from '../components/Dashboard/ContestDirectory';
import { useState } from 'react';

function Dashboard() {
   const [contestList, setContestList] = useState([]);

   console.log("dashboard", contestList);

   const handleContestListChange = (contests) => {
      setContestList(contests);
   }

   return (
      <div className="pv-4">
         <div className="grid grid-cols-12 gap-2">

            <div className="col-span-2 bg-white p-4 rounded-sm shadow-md">
               <PieChart />
            </div>

            <div className="col-span-10 bg-white p-4 rounded-sm shadow-md">
               <BarChart contestList={contestList} />
            </div>

            <div className="col-span-12 bg-white p-4 rounded-sm shadow-md">
               <ContestDirectory handleContestListChange={handleContestListChange} />
            </div>
         </div>
      </div>
   );
}

export default Dashboard;
