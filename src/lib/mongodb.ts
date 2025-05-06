// File: lib/mongodb.ts
import { MongoClient, ObjectId, Db, Document } from "mongodb";
import { Book, Collection } from "../../types";

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://akashakashbr41:Akashbr29@cluster0.d7egiou.mongodb.net/bookhaven?retryWrites=true&w=majority";
const dbName = process.env.MONGODB_DB || "bookhaven";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  if (cachedClient && cachedDb) return { client: cachedClient, db: cachedDb };

  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Book Functions
export async function getBooks(limit = 100): Promise<Book[]> {
  const { db } = await connectToDatabase();
  const books = await db
    .collection("books")
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return books.map((book: any) => ({
    ...book,
    _id: book._id.toString(),
  })) as Book[];
}

export async function getBookById(id: string): Promise<Book | null> {
  const { db } = await connectToDatabase();
  try {
    const book = await db
      .collection("books")
      .findOne({ _id: new ObjectId(id) });
    if (!book) return null;

    return {
      ...book,
      _id: book._id.toString(),
    } as Book;
  } catch (error) {
    console.error("Error fetching book:", error);
    return null;
  }
}

export async function addBook(bookData: Omit<Book, "_id">) {
  const { db } = await connectToDatabase();
  return await db.collection("books").insertOne({
    ...bookData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function updateBook(id: string, bookData: Partial<Book>) {
  const { db } = await connectToDatabase();
  return await db.collection("books").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...bookData,
        updatedAt: new Date(),
      },
    }
  );
}

export async function deleteBook(id: string) {
  const { db } = await connectToDatabase();
  return await db.collection("books").deleteOne({ _id: new ObjectId(id) });
}

// Collection Functions
export async function getUserCollections(
  userId: string = "default"
): Promise<Collection[]> {
  const { db } = await connectToDatabase();
  const collections = await db
    .collection("collections")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();

  return collections.map((collection: any) => ({
    ...collection,
    _id: collection._id.toString(),
    bookCount: collection.bookIds?.length || 0,
  })) as Collection[];
}

export async function getCollectionById(
  id: string
): Promise<Collection | null> {
  const { db } = await connectToDatabase();
  try {
    const collection = await db
      .collection("collections")
      .findOne({ _id: new ObjectId(id) });
    if (!collection) return null;

    const bookIds = collection.bookIds || [];
    const books = await db
      .collection("books")
      .find({
        _id: { $in: bookIds.map((id: any) => new ObjectId(id)) },
      })
      .toArray();

    return {
      ...collection,
      _id: collection._id.toString(),
      bookCount: bookIds.length,
      books: books.map((book: any) => ({
        ...book,
        _id: book._id.toString(),
      })),
    } as Collection;
  } catch (error) {
    console.error("Error fetching collection:", error);
    return null;
  }
}

export async function createCollection(
  collectionData: Omit<Collection, "_id">
) {
  const { db } = await connectToDatabase();
  return await db.collection("collections").insertOne({
    ...collectionData,
    bookIds: collectionData.bookIds || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function updateCollection(
  id: string,
  collectionData: Partial<Collection>
) {
  const { db } = await connectToDatabase();
  return await db.collection("collections").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...collectionData,
        updatedAt: new Date(),
      },
    }
  );
}

export async function deleteCollection(id: string) {
  const { db } = await connectToDatabase();
  return await db
    .collection("collections")
    .deleteOne({ _id: new ObjectId(id) });
}

export async function addBookToCollection(
  collectionId: string,
  bookId: string
) {
  const { db } = await connectToDatabase();
  return await db.collection("collections").updateOne(
    { _id: new ObjectId(collectionId) },
    {
      $addToSet: { bookIds: new ObjectId(bookId) },
      $set: { updatedAt: new Date() },
    }
  );
}

export async function removeBookFromCollection(
  collectionId: string,
  bookId: string
) {
  const { db } = await connectToDatabase();

  const result = await db.collection("collections").updateOne(
    { _id: new ObjectId(collectionId) },
    {
      $pull: { bookIds: new ObjectId(bookId) } as Document,
      $set: { updatedAt: new Date() },
    }
  );

  return result;
}

// Search Function
export async function searchBooks(query: string, limit = 100): Promise<Book[]> {
  const { db } = await connectToDatabase();
  const books = await db
    .collection("books")
    .find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { genre: { $regex: query, $options: "i" } },
      ],
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return books.map((book: any) => ({
    ...book,
    _id: book._id.toString(),
  })) as Book[];
}
