import axios from 'axios';
import slugify from 'slugify';

const DB_NAME = 'contestDB';
const STORE_NAME = 'Contests';
const STATS_STORE_NAME = 'Stats';
const EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes
const API_URL = 'https://codeforces.com/api/contest.list/';

async function openDB() {
   const request = indexedDB.open(DB_NAME, 1);

   return new Promise((resolve, reject) => {
      request.onupgradeneeded = () => {
         const db = request.result;
         if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            console.log("name")

         }
         if (!db.objectStoreNames.contains(STATS_STORE_NAME)) {
            db.createObjectStore(STATS_STORE_NAME, { keyPath: 'id' });
            console.log("stats")
         }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
   });
}


async function storeContests(contests) {
   const db = await openDB();
   const transaction = db.transaction(STORE_NAME, 'readwrite');
   const store = transaction.objectStore(STORE_NAME);

   for (const contest of contests) {
      const slug = slugify(contest.name, { lower: true });
      const contestData = {
         ...contest,
         slug,
         expiration: Date.now() + EXPIRATION_TIME,
      };
      store.put(contestData);
   }
}

async function storeStats(contests) {
   console.log("hit");
   const db = await openDB();
   const transaction = db.transaction(STATS_STORE_NAME, 'readwrite');
   const store = transaction.objectStore(STATS_STORE_NAME);

   // Initialize stats objects
   const stats = {
      type: {},
      phase: {},
      frozen: { true: 0, false: 0 },
      year: {},
      duration: {
         total: 0,
         byType: {},
         byPhase: {}
      }
   };

   for (const contest of contests) {

      // Aggregate stats
      // Type count
      stats.type[contest.type] = (stats.type[contest.type] || 0) + 1;

      // Phase count
      stats.phase[contest.phase] = (stats.phase[contest.phase] || 0) + 1;

      // Frozen count
      stats.frozen[contest.frozen.toString()] += 1;

      // Year count (extract year from startTimeSeconds)
      const year = new Date(contest.startTimeSeconds * 1000).getFullYear();
      stats.year[year] = (stats.year[year] || 0) + 1;

      // Duration stats
      stats.duration.total += contest.durationSeconds;
      stats.duration.byType[contest.type] = (stats.duration.byType[contest.type] || 0) + contest.durationSeconds;
      stats.duration.byPhase[contest.phase] = (stats.duration.byPhase[contest.phase] || 0) + contest.durationSeconds;
   }

   console.log(stats);

   // Store aggregated stats in the Stats object store
   store.put({
      id: 'type', // Store type stats under a specific key
      data: stats.type
   });

   store.put({
      id: 'phase', // Store phase stats
      data: stats.phase
   });

   store.put({
      id: 'frozen', // Store frozen stats
      data: stats.frozen
   });

   store.put({
      id: 'year', // Store year-wise stats
      data: stats.year
   });

   store.put({
      id: 'duration', // Store duration stats
      data: stats.duration
   });
}


async function getCachedContests() {
   const db = await openDB();
   const transaction = db.transaction(STORE_NAME, 'readonly');
   const store = transaction.objectStore(STORE_NAME);

   const contests = [];
   const cursorRequest = store.openCursor();

   return new Promise((resolve, reject) => {
      cursorRequest.onsuccess = (event) => {
         const cursor = event.target.result;
         if (cursor) {
            if (cursor.value.expiration > Date.now()) {
               contests.push(cursor.value);
            }
            cursor.continue();
         } else {
            resolve(contests.sort((a, b) => b.startTimeSeconds - a.startTimeSeconds));
         }
      };
      cursorRequest.onerror = (error) => reject(error);
   });
}

export async function fetchContests() {
   // Check if valid cache exists
   const cachedContests = await getCachedContests();
   if (cachedContests.length > 0) {
      console.log('Serving from cache');
      return;
   }

   try {
      const response = await axios.get(API_URL);
      if (response.data.status === 'OK' && response.data.result) {
         console.log('Fetching from API and storing in cache');
         await storeContests(response.data.result);
         await storeStats(response.data.result);
         // return response.data.result.sort((a, b) => b.startTimeSeconds - a.startTimeSeconds);
      }
   } catch (error) {
      console.error('Error fetching contests:', error);
   }

}

export async function fetchFirstXContests(page, limit) {
   const db = await openDB();
   const transaction = db.transaction(STORE_NAME, 'readonly');
   const store = transaction.objectStore(STORE_NAME);
   const contests = [];

   const cursorRequest = store.openCursor();
   let counter = 0;
   let skipCount = (page - 1) * limit;

   return new Promise((resolve, reject) => {
      cursorRequest.onsuccess = async (event) => {
         const cursor = event.target.result;

         if (cursor) {
            // Check if contest is valid and not expired
            if (cursor.value.expiration > Date.now()) {
               if (counter >= skipCount && contests.length < limit) {
                  contests.push(cursor.value); // Add contest to the result
               }
               counter++; // Increment the counter
            }
            cursor.continue(); // Move to the next contest
         } else {
            // If no contests found, fetch from API
            if (contests.length === 0) {
               try {
                  console.log("hit");
                  await fetchContests(); // Fetch new contests and store in IndexedDB
                  // Call fetch again to get the newly stored contests
                  resolve(await fetchFirstXContests(page, limit));
               } catch (error) {
                  reject(error);
               }
            } else {
               resolve(contests); // Return the contests for the current page
            }
         }
      };

      cursorRequest.onerror = (error) => reject(error);
   });
}

export async function searchContestsBySlug(query) {
   const db = await openDB();
   const transaction = db.transaction(STORE_NAME, 'readonly');
   const store = transaction.objectStore(STORE_NAME);
   const contests = [];

   const cursorRequest = store.openCursor();

   return new Promise((resolve, reject) => {
      cursorRequest.onsuccess = (event) => {
         const cursor = event.target.result;
         if (cursor) {
            if (cursor.value.slug.includes(query.toLowerCase()) && cursor.value.expiration > Date.now()) {
               contests.push(cursor.value);
            }
            cursor.continue();
         } else {
            resolve(contests.sort((a, b) => b.startTimeSeconds - a.startTimeSeconds)); // Sort contests
         }
      };
      cursorRequest.onerror = (error) => reject(error);
   });
}

export async function fetchContestFromCache(id) {
   const db = await openDB();
   const transaction = db.transaction(STORE_NAME, 'readonly');
   const store = transaction.objectStore(STORE_NAME);

   return new Promise((resolve, reject) => {
      console.log(typeof (id));
      console.log("Fetching contest with id:", Number(id));  // Debugging log
      const request = store.get(Number(id)); // Get contest by id

      request.onsuccess = (event) => {
         const contest = event.target.result;
         if (contest) {
            console.log("Contest found:", contest);  // Debugging log
            console.log("Contest expiration:", contest.expiration); // Log the expiration
            if (contest.expiration > Date.now()) {
               console.log("Contest is valid, returning:", contest);  // Debugging log
               resolve(contest); // Return contest if not expired
            } else {
               console.log("Contest expired, fetching fresh contests..."); // Debugging log
               fetchContests(); // Fetch fresh contests if expired
               resolve(null); // Return null if contest is expired
            }
         } else {
            console.log("Contest not found in IndexedDB.");
            resolve(null); // Return null if contest is not found
         }
      };

      request.onerror = (error) => {
         console.error("Error fetching contest from IndexedDB:", error); // Error handling log
         reject(error);
      };
   });
}

export function getPhaseStats() {
   return new Promise((resolve, reject) => {
      openDB().then((db) => {
         const transaction = db.transaction(STATS_STORE_NAME, 'readonly');
         const store = transaction.objectStore(STATS_STORE_NAME);

         const request = store.get('phase');
         request.onsuccess = () => {
            resolve(request.result?.data || {});
         };
         request.onerror = () => {
            reject(new Error('Failed to fetch phase stats'));
         };
      }).catch(reject); // Reject if openDB fails
   });
}

export function getTypeStats() {
   return new Promise((resolve, reject) => {
      openDB().then((db) => {
         const transaction = db.transaction(STATS_STORE_NAME, 'readonly');
         const store = transaction.objectStore(STATS_STORE_NAME);

         const request = store.get('type');
         request.onsuccess = () => {
            resolve(request.result?.data || {});
         };
         request.onerror = () => {
            reject(new Error('Failed to fetch type stats'));
         };
      }).catch(reject); // Reject if openDB fails
   });
}

export function getYearStats() {
   return new Promise((resolve, reject) => {
      openDB().then((db) => {
         const transaction = db.transaction(STATS_STORE_NAME, 'readonly');
         const store = transaction.objectStore(STATS_STORE_NAME);

         const request = store.get('year');
         request.onsuccess = () => {
            resolve(request.result?.data || {});
         };
         request.onerror = () => {
            reject(new Error('Failed to fetch year stats'));
         };
      }).catch(reject); // Reject if openDB fails
   });
}
