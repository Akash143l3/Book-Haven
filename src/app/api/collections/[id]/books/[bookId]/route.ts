import { removeBookFromCollection } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: {
    id: string;
    bookId: string;
  };
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const result = await removeBookFromCollection(params.id, params.bookId);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error removing book from collection:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to remove book",
      },
      { status: 500 }
    );
  }
}
