// app/api/borrowed-books/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getBorrowedBooks, searchBorrowedBooks } from "@/lib/mongodb";
import { BorrowedBook } from "../../../../types";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const limitParam = searchParams.get("limit");
    const limitNum = limitParam ? parseInt(limitParam) : 100;

    let borrowedBooks: BorrowedBook[];

    if (search) {
      borrowedBooks = await searchBorrowedBooks(search, limitNum);
    } else {
      borrowedBooks = await getBorrowedBooks(limitNum);
    }

    return NextResponse.json(borrowedBooks, { status: 200 });
  } catch (error) {
    console.error("Error fetching borrowed books:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
