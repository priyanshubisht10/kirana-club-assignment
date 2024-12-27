import PieChart from '../components/Dashboard/PieChart';
import Statistics from '../components/Dashboard/Statistics';
import BarChart from '../components/Dashboard/BarChart';
import ContestDirectory from '../components/Dashboard/ContestDirectory';

function Dashboard() {
   return (
      <div className="pv-4">
         <div className="grid grid-cols-12 gap-2">

            <div className="col-span-2 bg-white p-4 rounded-sm shadow-md">
               <PieChart />
            </div>

            <div className="col-span-10 bg-white p-4 rounded-sm shadow-md">
               <BarChart />
            </div>

            <div className="col-span-2 bg-white p-4 rounded-sm shadow-md ">
               <Statistics />
            </div>

            <div className="col-span-10 bg-white p-4 rounded-sm shadow-md">
               <ContestDirectory />
            </div>
         </div>
      </div>
   );
}

export default Dashboard;
