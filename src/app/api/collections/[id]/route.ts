import { NextRequest, NextResponse } from "next/server";
import {
  getCollectionById,
  updateCollection,
  deleteCollection,
} from "../../../../lib/mongodb";

interface Params {
  params: {
    id: string;
  };
}

// GET /api/collections/[id] - Get a collection by ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const collection = await getCollectionById(params.id);

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(collection);
  } catch (error) {
    console.error("Error fetching collection:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}

// PUT /api/collections/[id] - Update a collection
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const collectionData = await request.json();
    const result = await updateCollection(params.id, collectionData);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating collection:", error);
    return NextResponse.json(
      { error: "Failed to update collection" },
      { status: 500 }
    );
  }
}

// DELETE /api/collections/[id] - Delete a collection
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const result = await deleteCollection(params.id);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting collection:", error);
    return NextResponse.json(
      { error: "Failed to delete collection" },
      { status: 500 }
    );
  }
}
