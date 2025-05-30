import { NextRequest, NextResponse } from "next/server";
import { getOverdueBooks, updateOverdueStatus } from "@/lib/mongodb";
import { BorrowedBook } from "../../../../../types";



// GET /api/borrowed-books/overdue - Get overdue books
export async function GET(): Promise<NextResponse> {
  try {
    const overdueBooks: BorrowedBook[] = await getOverdueBooks();

    // Multiply fine amount with default rupee rate for display
    const overdueeBooksWithRupeeFine = overdueBooks.map((book) => ({
      ...book,
      fine: (book.fine || 0) ,
      fineDisplay: `₹${((book.fine || 0) ).toFixed(
        2
      )}`,
    }));

    return NextResponse.json(overdueeBooksWithRupeeFine, { status: 200 });
  } catch (error) {
    console.error("Error fetching overdue books:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/borrowed-books/overdue - Update overdue status and calculate fines
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const finePerDay = body.finePerDay ;

    const updatedCount = await updateOverdueStatus(finePerDay);

    return NextResponse.json(
      {
        message: `Updated ${updatedCount} overdue books with fine of ₹${finePerDay} per day`,
        updatedCount,
        finePerDay: `₹${finePerDay}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating overdue status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
