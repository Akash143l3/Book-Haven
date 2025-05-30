import { NextRequest, NextResponse } from "next/server";
import { returnBook } from "@/lib/mongodb";
import { ReturnBookRequest } from "../../../../../types";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = req.nextUrl;
    const borrowId = searchParams.get("borrowId");
    const returnData: ReturnBookRequest = await req.json();

    if (!borrowId || typeof borrowId !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Valid borrow ID is required",
        },  
        { status: 400 }
      );
    }

    const result = await returnBook(borrowId, returnData);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("Error in return book API:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
