import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Contest from './pages/Contest.jsx';
import { fetchContests } from './services/contestService.js';
import { useState, useEffect } from 'react';
import Loader from './components/Common/Loader.jsx';

function App() {
  // const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAndStoreContests = async () => {
    try {
      await fetchContests();
      // setContests(storedContests);
    } catch (error) {
      console.error('Error fetching or storing contests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndStoreContests();
  }, []);

  return (<>
    <header className="text-center">
      <h1 className="text-3xl font-bold mt-2">Kirana-Club-Assignment</h1>
    </header>
    <Router>
      <div className="p-4">

        {loading ? (
          <Loader />
        ) : (
          <Routes>
            <Route
              path="/"
              element={<Dashboard />}
            />
            <Route path="/contest/:contest_id" element={<Contest />} />
          </Routes>
        )}
      </div>
    </Router>
  </>
  );
}

export default App;
