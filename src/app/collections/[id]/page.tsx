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
import { Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import Image from "next/image";

interface Book {
  _id: string;
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
}

interface Collection {
  _id: string;
  name: string;
  description?: string;
  coverImage?: string;
  userId: string;
  bookIds: string[];
  createdAt: string;
  updatedAt: string;
}

export default function CollectionPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();

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

  // For cover image handling
  const [newCoverImage, setNewCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );

  // Function to convert image file to base64
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

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
  }, [id, toast]);

  // Reset cover image preview when dialog opens
  useEffect(() => {
    if (editOpen && collection) {
      setCoverImagePreview(collection.coverImage || null);
      setNewCoverImage(null);
    }
  }, [editOpen, collection]);

  // Handle cover image change
  const handleCoverImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewCoverImage(file);

      try {
        const base64 = await convertImageToBase64(file);
        setCoverImagePreview(base64);
      } catch (error) {
        console.error("Error converting image:", error);
        toast({
          title: "Error",
          description: "Failed to process image",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdate = async () => {
    if (!collection) return;
    setIsUpdating(true);

    try {
      let updatedData: Partial<Collection> = {
        name: collection.name,
        description: collection.description,
      };

      // If a new cover image was selected, include it in the update
      if (newCoverImage) {
        const base64Image = await convertImageToBase64(newCoverImage);
        updatedData.coverImage = base64Image;
      }

      await fetch(`/api/collections/${id}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });

      toast({ title: "Collection updated successfully." });
      setEditOpen(false);

      const res = await fetch(`/api/collections/${id}`);
      const updated = await res.json();
      setCollection(updated);
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
    <div className="p-8 max-w-5xl mx-auto space-y-6 my-6 border-t bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        {isPending ? (
          <Skeleton className="h-8 w-40" />
        ) : (
          <>
            <div className="flex items-center space-x-4">
              {collection?.coverImage && (
                <div className="w-16 h-16 relative rounded-md overflow-hidden">
                  <Image
                    src={collection.coverImage}
                    alt={collection.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h1 className="text-4xl font-extrabold text-gray-800">
                {collection?.name}
              </h1>
            </div>
          </>
        )}

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              Edit Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
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
                className="border-gray-300"
              />

              <Label>Description</Label>
              <Textarea
                value={collection?.description || ""}
                onChange={(e) =>
                  setCollection((prev) =>
                    prev ? { ...prev, description: e.target.value } : prev
                  )
                }
                className="border-gray-300"
              />

              <div className="space-y-2">
                <Label>Cover Image</Label>

                {/* Cover Image Preview */}
                {coverImagePreview && (
                  <div className="w-full h-40 relative rounded-md overflow-hidden border border-gray-300 mb-2">
                    <Image
                      src={coverImagePreview}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* File Input */}
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="border-gray-300 flex-1"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="flex-1"
                >
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
                  className="flex-1"
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
        <p className="text-muted-foreground text-lg text-gray-500">
          {collection?.description || "No description available."}
        </p>
      )}

      <hr className="my-6 border-t-2 border-gray-200" />
      <h2 className="text-3xl font-semibold text-gray-700">
        Books in Collection
      </h2>

      {isPending ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : books.length === 0 ? (
        <p className="text-sm text-gray-500">No books added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="relative flex flex-col items-start w-full border border-gray-300 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out"
            >
              {/* Card Content */}
              <Link
                href={`/books/${book._id}`}
                key={book._id}
                className="relative flex flex-col items-start w-full space-y-4"
              >
                {/* Book Cover */}
                {book.coverImage && (
                  <div className="w-full h-48 relative rounded-md overflow-hidden mb-4">
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Title and Author */}
                <div className="text-center space-y-2">
                  <div className="font-semibold text-2xl text-gray-900">
                    {book.title}
                  </div>
                  <div className="text-sm text-gray-600">{book.author}</div>
                </div>

                {/* Book Description */}
                {book.description && (
                  <div className="text-sm text-gray-700 mt-4">
                    <p>{book.description}</p>
                  </div>
                )}
              </Link>

              {/* Remove Button */}
              <Button
                variant="outline"
                onClick={() => handleRemoveBook(book._id)}
                className="mt-4 self-start text-sm text-gray-700 hover:text-white hover:bg-gray-700 transition-colors duration-200"
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
      )}

      <div className="mt-6 space-y-4">
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
