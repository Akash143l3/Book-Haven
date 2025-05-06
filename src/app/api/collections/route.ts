// File: app/api/collections/route.ts - Collections API routes
import { NextRequest, NextResponse } from "next/server";
import { getUserCollections, createCollection } from "../../../lib/mongodb";

// GET /api/collections - Get user collections
export async function GET(request: NextRequest) {
  try {
    // In a real app, you would get the userId from authentication
    const userId = "default";
    const collections = await getUserCollections(userId);
    return NextResponse.json(collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}

// POST /api/collections - Create a new collection
export async function POST(request: NextRequest) {
  try {
    const collectionData = await request.json();

    // Basic validation
    if (!collectionData.name) {
      return NextResponse.json(
        { error: "Collection name is required" },
        { status: 400 }
      );
    }

    // In a real app, you would get the userId from authentication
    collectionData.userId = collectionData.userId || "default";

    const result = await createCollection(collectionData);
    return NextResponse.json(
      { id: result.insertedId, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating collection:", error);
    return NextResponse.json(
      { error: "Failed to create collection" },
      { status: 500 }
    );
  }
}
