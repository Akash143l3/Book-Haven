import { updateOverdueStatus } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
      // Add admin authentication here
      const updatedCount = await updateOverdueStatus(50);
      
      return NextResponse.json({
        message: `Manual fine update completed. Updated ${updatedCount} books.`,
        updatedCount,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return NextResponse.json(
        { message: 'Error updating fines' },
        { status: 500 }
      );
    }
  }