import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchContestFromCache } from '../services/contestService.js';
import { Card, Text, Badge, Button, Box } from '@shopify/polaris';
import { PlusIcon } from '@shopify/polaris-icons';

function Contest() {
   const { contest_id } = useParams();
   const [contest, setContest] = useState(null);
   const [loading, setLoading] = useState(true);
   const [isFavorite, setIsFavorite] = useState(false);

   useEffect(() => {
      const fetchContestDetails = async () => {
         try {
            const contestData = await fetchContestFromCache(Number(contest_id));
            setContest(contestData);

            // Check if the contest is in favorites
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            setIsFavorite(favorites.includes(Number(contest_id)));

            setLoading(false);
         } catch (error) {
            console.error('Error fetching contest details:', error);
            setLoading(false);
         }
      };

      fetchContestDetails();
   }, [contest_id]);

   const toggleFavorite = () => {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

      if (isFavorite) {
         const updatedFavorites = favorites.filter((id) => id !== Number(contest_id));
         localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      } else {
         favorites.push(Number(contest_id));
         localStorage.setItem('favorites', JSON.stringify(favorites));
      }

      setIsFavorite(!isFavorite);
   };

   if (loading) {
      return <Box padding="4">Loading...</Box>;
   }

   if (!contest) {
      return <Box padding="4">Contest not found</Box>;
   }

   const startTime = new Date(contest.startTimeSeconds * 1000).toLocaleString();

   return (
      <Box padding="6" background="surface" borderRadius="4" boxShadow="base">
         <Card>
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="4">
               <Text as="h2" variant="headingMd" className="text-2xl font-semibold text-gray-800">
                  {contest.name}
               </Text>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginTop="4">

               <Box flex="1" textAlign="left">
                  <Text variant="bodyMd" className="text-gray-600 mt-2">
                     ID: {contest.id}
                  </Text>
                  <Text variant="bodyMd" className="text-gray-600 mt-2">
                     Type: {contest.type}
                  </Text>
                  <Text variant="bodyMd" className="text-gray-600 mt-2">
                     Phase: <Badge status="info">{contest.phase}</Badge>
                  </Text>
                  <Text variant="bodyMd" className="text-gray-600 mt-2">
                     Frozen: {contest.frozen ? 'Yes' : 'No'}
                  </Text>
                  <Text variant="bodyMd" className="text-gray-600 mt-2">
                     Duration: {Math.floor(contest.durationSeconds / 3600)} hours{' '}
                     {Math.floor((contest.durationSeconds % 3600) / 60)} minutes
                  </Text>
                  <Text variant="bodyMd" className="text-gray-600 mt-2">
                     Start Time: {startTime}
                  </Text>
                  {contest.description && (
                     <Text variant="bodyMd" className="text-gray-600 mt-4">
                        Description: {contest.description}
                     </Text>
                  )}
               </Box>

               <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-end" marginTop="4">
                  <Button icon={PlusIcon} onClick={toggleFavorite}>
                     {isFavorite ? 'Unmark as Favorite' : 'Mark as Favorite'}
                  </Button>
               </Box>
            </Box>

         </Card>
      </Box>
   );
}

export default Contest;