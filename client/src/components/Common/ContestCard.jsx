import { Card, Text, Badge, Button } from '@shopify/polaris';

function ContestCard({ contest }) {
   if (!contest) {
      return null; 
   }
   console.log(contest);
   const startTime = new Date(contest.startTimeSeconds * 1000).toLocaleString();
   const url = `/contest/${contest.id}`;
   return (
      <Card>
         <Text>{contest.name}</Text>
         <Text>Type: {contest.type}</Text>
         <Text>
            Phase: <Badge status="info">{contest.phase}</Badge>
         </Text>
         <Text>Start Time: {startTime}</Text>

         <Button url={url}>View More</Button>
      </Card>
   );
}

export default ContestCard;
