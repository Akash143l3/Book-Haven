"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"; // ✅ Toast

interface Book {
  _id: string;
  title: string;
  author: string;
  description?: string;
}

interface Collection {
  _id: string;
  name: string;
  description?: string;
  userId: string;
  bookIds: string[];
  createdAt: string;
  updatedAt: string;
}

export default function CollectionPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast(); // ✅ Init toast

  const [collection, setCollection] = useState<Collection | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [isPending, setIsPending] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [isRemovingBook, setIsRemovingBook] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setIsPending(true);
        const res = await fetch(`/api/collections/${id}`);
        const data = await res.json();
        setCollection(data);

        const bookRes = await fetch(`/api/collections/${id}/books`);
        const booksData = await bookRes.json();
        setBooks(booksData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch collection",
          variant: "destructive",
        });
      } finally {
        setIsPending(false);
      }
    };

    const fetchAllBooks = async () => {
      try {
        const res = await fetch(`/api/books`);
        const data = await res.json();
        setAllBooks(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch all books",
          variant: "destructive",
        });
      }
    };

    if (id) {
      fetchCollection();
      fetchAllBooks();
    }
  }, [id, toast]); // ✅ Added toast to dependencies

  const handleUpdate = async () => {
    if (!collection) return;
    setIsUpdating(true);

    try {
      await fetch(`/api/collections/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: collection.name,
          description: collection.description,
        }),
      });

      toast({ title: "Collection updated successfully." });
      setEditOpen(false);

      const res = await fetch(`/api/collections/${id}`);
      const updatedData = await res.json();
      setCollection(updatedData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetch(`/api/collections/${id}`, { method: "DELETE" });
      toast({
        title: "Deleted",
        description: "Collection deleted successfully.",
        variant: "destructive",
      });
      router.push("/collections");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete",
        variant: "destructive",
      });
    }
  };

  const handleAddBook = async () => {
    if (!selectedBookId) return;
    setIsAddingBook(true);
    try {
      await fetch(`/api/collections/${id}/books`, {
        method: "POST",
        body: JSON.stringify({ bookId: selectedBookId }),
      });

      toast({
        title: "Success",
        description: "Book added to the collection.",
        variant: "default",
      });

      setSelectedBookId("");
      const bookRes = await fetch(`/api/collections/${id}/books`);
      const booksData = await bookRes.json();
      setBooks(booksData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add book",
        variant: "destructive",
      });
    } finally {
      setIsAddingBook(false);
    }
  };

  const handleRemoveBook = async (bookId: string) => {
    setIsRemovingBook(bookId);
    try {
      await fetch(`/api/collections/${id}/books/${bookId}`, {
        method: "DELETE",
      });

      toast({
        title: "Removed",
        description: "Book removed from the collection.",
        variant: "default",
      });

      const bookRes = await fetch(`/api/collections/${id}/books`);
      const booksData = await bookRes.json();
      setBooks(booksData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove book",
        variant: "destructive",
      });
    } finally {
      setIsRemovingBook(null);
    }
  };

  const availableBooks = allBooks.filter(
    (book) => !books.some((b) => b._id === book._id)
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        {isPending ? (
          <Skeleton className="h-8 w-40" />
        ) : (
          <h1 className="text-3xl font-bold">{collection?.name}</h1>
        )}

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <Button>Edit Collection</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Collection</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label>Name</Label>
              <Input
                value={collection?.name || ""}
                onChange={(e) =>
                  setCollection((prev) =>
                    prev ? { ...prev, name: e.target.value } : prev
                  )
                }
              />
              <Label>Description</Label>
              <Textarea
                value={collection?.description || ""}
                onChange={(e) =>
                  setCollection((prev) =>
                    prev ? { ...prev, description: e.target.value } : prev
                  )
                }
              />
              <div className="flex gap-2">
                <Button onClick={handleUpdate} disabled={isUpdating}>
                  {isUpdating ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    "Update"
                  )}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isPending ? (
        <Skeleton className="h-5 w-60" />
      ) : (
        <p className="text-muted-foreground">
          {collection?.description || "No description available."}
        </p>
      )}

      <hr className="my-6" />
      <h2 className="text-2xl font-semibold">Books in Collection</h2>

      {isPending ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : books.length === 0 ? (
        <p className="text-sm text-muted-foreground">No books added yet.</p>
      ) : (
        <div className="max-h-[400px] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="flex flex-col items-start border p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 ease-in-out"
              >
                <div className="space-y-2">
                  <div className="font-medium text-xl">{book.title}</div>
                  <div className="text-sm text-gray-500">{book.author}</div>
                </div>
                {book.description && (
                  <div className="mt-4 text-sm text-gray-700">
                    <p>{book.description}</p>
                  </div>
                )}
                <Button
                  variant="outline"
                  onClick={() => handleRemoveBook(book._id)}
                  className="mt-4 self-start"
                  disabled={isRemovingBook === book._id}
                >
                  {isRemovingBook === book._id ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    "Remove"
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 space-y-2">
        <Label>Select Book to Add</Label>
        <select
          className="w-full border rounded-md p-2"
          value={selectedBookId}
          onChange={(e) => setSelectedBookId(e.target.value)}
        >
          <option value="">-- Select a Book --</option>
          {availableBooks.map((book) => (
            <option key={book._id} value={book._id}>
              {book.title} by {book.author}
            </option>
          ))}
        </select>
        <Button
          onClick={handleAddBook}
          disabled={isAddingBook || !selectedBookId}
          className="w-full"
        >
          {isAddingBook ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            "Add Book"
          )}
        </Button>
      </div>
    </div>
  );
}
