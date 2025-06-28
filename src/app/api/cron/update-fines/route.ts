import { updateOverdueStatus } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
      // Verify cron secret for security (optional)
      const cronSecret = req.headers.get('x-cron-secret');
      if (cronSecret !== process.env.CRON_SECRET) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
  
      const updatedCount = await updateOverdueStatus(50);
  
      return NextResponse.json({
        success: true,
        message: `Daily fine update completed. Updated ${updatedCount} books.`,
        updatedCount,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Cron job error:', error);
      return NextResponse.json(
        { success: false, message: 'Error updating fines' },
        { status: 500 }
      );
    }
  }