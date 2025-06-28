import cron from 'node-cron';
import { connectToDatabase, updateOverdueStatus } from './mongodb';

export function startDailyFineUpdates() {
  // Run every day at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('Starting daily fine update...');
      
      // Call the update function
      const updatedCount = await updateOverdueStatus(50); // ₹50 per day
      
      console.log(`Daily fine update completed. Updated ${updatedCount} books.`);
      
      // Optional: Log to database for tracking
      const { db } = await connectToDatabase();
      await db.collection("fine_update_logs").insertOne({
        date: new Date(),
        updatedBooks: updatedCount,
        finePerDay: 50,
        type: 'scheduled'
      });
      
    } catch (error) {
      console.error('Error in daily fine update:', error);
    }
  });
  
  console.log('Daily fine update cron job started');
}
