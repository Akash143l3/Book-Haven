// File: lib/mongodb.ts
import { MongoClient, ObjectId, Db, Document } from "mongodb";
import { Book, Collection, BorrowedBook } from "../../types";

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
    availableStock: bookData.availableStock || 1,
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

// Update book stock
export async function updateBookStock(id: string, change: number) {
  const { db } = await connectToDatabase();
  return await db.collection("books").updateOne(
    { _id: new ObjectId(id) },
    {
      $inc: { availableStock: change },
      $set: { updatedAt: new Date() },
    }
  );
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

// BORROWED BOOKS FUNCTIONS

// Get all borrowed books
export async function getBorrowedBooks(limit = 100): Promise<BorrowedBook[]> {
  const { db } = await connectToDatabase();
  const borrowedBooks = await db
    .collection("borrowed_books")
    .find({})
    .sort({ borrowDate: -1 })
    .limit(limit)
    .toArray();

  return borrowedBooks.map((book: any) => ({
    ...book,
    _id: book._id.toString(),
    bookId: book.bookId.toString(),
  })) as BorrowedBook[];
}

// Get borrowed book by ID
export async function getBorrowedBookById(
  id: string
): Promise<BorrowedBook | null> {
  const { db } = await connectToDatabase();
  try {
    const borrowedBook = await db
      .collection("borrowed_books")
      .findOne({ _id: new ObjectId(id) });
    if (!borrowedBook) return null;

    return {
      ...borrowedBook,
      _id: borrowedBook._id.toString(),
      bookId: borrowedBook.bookId.toString(),
    } as BorrowedBook;
  } catch (error) {
    console.error("Error fetching borrowed book:", error);
    return null;
  }
}

// Get borrowed books by borrower email
export async function getBorrowedBooksByBorrower(
  borrowerEmail: string
): Promise<BorrowedBook[]> {
  const { db } = await connectToDatabase();
  const borrowedBooks = await db
    .collection("borrowed_books")
    .find({ borrowerEmail })
    .sort({ borrowDate: -1 })
    .toArray();

  return borrowedBooks.map((book: any) => ({
    ...book,
    _id: book._id.toString(),
    bookId: book.bookId.toString(),
  })) as BorrowedBook[];
}

// Get overdue books
export async function getOverdueBooks(): Promise<BorrowedBook[]> {
  const { db } = await connectToDatabase();
  const today = new Date();

  const overdueBooks = await db
    .collection("borrowed_books")
    .find({
      dueDate: { $lt: today },
      status: { $in: ["borrowed", "overdue"] },
    })
    .sort({ dueDate: 1 })
    .toArray();

  return overdueBooks.map((book: any) => ({
    ...book,
    _id: book._id.toString(),
    bookId: book.bookId.toString(),
  })) as BorrowedBook[];
}

// Borrow a book - Transaction to ensure data consistency
export async function borrowBook(borrowData: {
  borrowerName: string;
  borrowerEmail: string;
  borrowerPhone?: string;
  bookId: string;
  dueDate: Date;
  notes?: string;
}): Promise<{ success: boolean; message: string; borrowId?: string }> {
  const { client, db } = await connectToDatabase();
  const session = client.startSession();

  try {
    let result: any = null;
    await session.withTransaction(async () => {
      // Check if book exists and has available stock
      const book = await db
        .collection("books")
        .findOne({ _id: new ObjectId(borrowData.bookId) }, { session });

      if (!book) {
        throw new Error("Book not found");
      }

      if (!book.availableStock || book.availableStock <= 0) {
        throw new Error("Book is not available for borrowing");
      }

      // Get book details for the borrow record
      const borrowRecord = {
        borrowerName: borrowData.borrowerName,
        borrowerEmail: borrowData.borrowerEmail,
        borrowerPhone: borrowData.borrowerPhone || "",
        bookId: new ObjectId(borrowData.bookId),
        bookTitle: book.title,
        bookAuthor: book.author,
        borrowDate: new Date(),
        dueDate: borrowData.dueDate,
        status: "borrowed" as const,
        notes: borrowData.notes || "",
        fine: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Insert borrow record
      const borrowResult = await db
        .collection("borrowed_books")
        .insertOne(borrowRecord, { session });

      // Decrease available stock
      await db.collection("books").updateOne(
        { _id: new ObjectId(borrowData.bookId) },
        {
          $inc: { availableStock: -1 },
          $set: { updatedAt: new Date() },
        },
        { session }
      );

      result = borrowResult;
    });

    return {
      success: true,
      message: "Book borrowed successfully",
      borrowId: result?.insertedId?.toString(),
    };
  } catch (error) {
    console.error("Error borrowing book:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to borrow book",
    };
  } finally {
    await session.endSession();
  }
}

// Return a book - Transaction to ensure data consistency
export async function returnBook(
  borrowId: string,
  returnData?: { fine?: number; notes?: string }
): Promise<{ success: boolean; message: string }> {
  const { client, db } = await connectToDatabase();
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      // Get the borrow record
      const borrowRecord = await db
        .collection("borrowed_books")
        .findOne({ _id: new ObjectId(borrowId) }, { session });

      if (!borrowRecord) {
        throw new Error("Borrow record not found");
      }

      if (borrowRecord.status === "returned") {
        throw new Error("Book has already been returned");
      }

      // Update borrow record
      await db.collection("borrowed_books").updateOne(
        { _id: new ObjectId(borrowId) },
        {
          $set: {
            status: "returned",
            returnDate: new Date(),
            fine: returnData?.fine || borrowRecord.fine || 0,
            notes: returnData?.notes || borrowRecord.notes || "",
            updatedAt: new Date(),
          },
        },
        { session }
      );

      // Increase available stock
      await db.collection("books").updateOne(
        { _id: borrowRecord.bookId },
        {
          $inc: { availableStock: 1 },
          $set: { updatedAt: new Date() },
        },
        { session }
      );
    });

    return {
      success: true,
      message: "Book returned successfully",
    };
  } catch (error) {
    console.error("Error returning book:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to return book",
    };
  } finally {
    await session.endSession();
  }
}

// Update borrowed book (for fines, notes, etc.)
export async function updateBorrowedBook(
  id: string,
  updateData: Partial<BorrowedBook>
) {
  const { db } = await connectToDatabase();
  return await db.collection("borrowed_books").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...updateData,
        updatedAt: new Date(),
      },
    }
  );
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

// Search borrowed books
export async function searchBorrowedBooks(
  query: string,
  limit = 100
): Promise<BorrowedBook[]> {
  const { db } = await connectToDatabase();
  const borrowedBooks = await db
    .collection("borrowed_books")
    .find({
      $or: [
        { borrowerName: { $regex: query, $options: "i" } },
        { borrowerEmail: { $regex: query, $options: "i" } },
        { bookTitle: { $regex: query, $options: "i" } },
        { bookAuthor: { $regex: query, $options: "i" } },
      ],
    })
    .sort({ borrowDate: -1 })
    .limit(limit)
    .toArray();

  return borrowedBooks.map((book: any) => ({
    ...book,
    _id: book._id.toString(),
    bookId: book.bookId.toString(),
  })) as BorrowedBook[];
}


// 1. Enhanced updateOverdueStatus function that recalculates fines daily
export async function updateOverdueStatus(
  finePerDay: number = 50
): Promise<number> {
  const { db } = await connectToDatabase();
  const today = new Date();

  // Find all overdue books (both newly overdue and already overdue)
  const overdueBooks = await db
    .collection("borrowed_books")
    .find({
      dueDate: { $lt: today },
      status: { $in: ["borrowed", "overdue"] }, // Include both statuses
    })
    .toArray();

  let updatedCount = 0;

  for (const book of overdueBooks) {
    const daysOverdue = Math.ceil(
      (today.getTime() - new Date(book.dueDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const fine = daysOverdue * finePerDay; // Recalculate fine based on current days overdue

    await db.collection("borrowed_books").updateOne(
      { _id: book._id },
      {
        $set: {
          status: "overdue",
          fine: fine, // Update fine amount
          daysOverdue: daysOverdue,
          lastFineUpdate: new Date(), // Track when fine was last updated
          updatedAt: new Date(),
        },
      }
    );
    updatedCount++;
  }

  return updatedCount;
}