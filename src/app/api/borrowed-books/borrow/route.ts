import { NextRequest, NextResponse } from "next/server";
import { borrowBook } from "@/lib/mongodb";
import { BorrowBookRequest } from "../../../../../types";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const borrowData: BorrowBookRequest = await req.json();

    // Validate required fields
    if (
      !borrowData.borrowerName ||
      !borrowData.borrowerEmail ||
      !borrowData.bookId ||
      !borrowData.dueDate
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: borrowerName, borrowerEmail, bookId, dueDate",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(borrowData.borrowerEmail)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate due date
    const dueDate = new Date(borrowData.dueDate);
    const today = new Date();
    if (dueDate <= today) {
      return NextResponse.json(
        { success: false, message: "Due date must be in the future" },
        { status: 400 }
      );
    }

    const result = await borrowBook({
      borrowerName: borrowData.borrowerName,
      borrowerEmail: borrowData.borrowerEmail,
      borrowerPhone: borrowData.borrowerPhone,
      bookId: borrowData.bookId,
      dueDate,
      notes: borrowData.notes,
    });

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("Error in borrow book API:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
