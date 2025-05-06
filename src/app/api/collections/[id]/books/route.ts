// File: app/api/collections/[id]/books/route.ts - Collection books API routes
import { NextRequest, NextResponse } from "next/server";
import {
  addBookToCollection,
  removeBookFromCollection,
  connectToDatabase,
} from "@/lib/mongodb";

import { ObjectId } from "mongodb";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToDatabase();
    const collection = await db.db
      .collection("collections")
      .findOne({ _id: new ObjectId(params.id) });

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    const books = await db.db
      .collection("books")
      .find({
        _id: { $in: collection.bookIds.map((id: string) => new ObjectId(id)) },
      })
      .toArray();

    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books in collection" },
      { status: 500 }
    );
  }
}

// POST /api/collections/[id]/books - Add a book to a collection
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { bookId } = await request.json();

    if (!bookId) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    const result = await addBookToCollection(params.id, bookId);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding book to collection:", error);
    return NextResponse.json(
      { error: "Failed to add book to collection" },
      { status: 500 }
    );
  }
}
