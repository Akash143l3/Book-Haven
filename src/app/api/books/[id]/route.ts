import { NextRequest, NextResponse } from "next/server";
import {
  getBookById,
  updateBook,
  deleteBook,
  connectToDatabase,
} from "../../../../lib/mongodb";
import { Collection, ObjectId } from "mongodb";

interface Params {
  params: {
    id: string;
  };
}

// GET /api/books/[id] - Get a book by ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const book = await getBookById(params.id);

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}

// PUT /api/books/[id] - Update a book
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const bookData = await request.json();

    // If updating coverImage is included in the request, ensure it's properly handled
    // If coverImage is explicitly set to null or empty string, we'll keep that value
    if (!("coverImage" in bookData)) {
      // If coverImage isn't provided in the update, we don't modify the existing value
      // So we don't need to do anything special here
    }

    const result = await updateBook(params.id, bookData);

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

// DELETE /api/books/[id] - Delete a book
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { db } = await connectToDatabase();
    const bookId = new ObjectId(params.id);

    // 1. Delete the book
    const result = await deleteBook(params.id);
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    await db.collection("collections").updateMany(
      { bookIds: bookId },
      {
        $pull: { bookIds: bookId } as any,
        $set: { updatedAt: new Date() },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
