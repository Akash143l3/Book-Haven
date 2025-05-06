"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Skeleton Loader Component
const SkeletonLoader = () => {
  return (
    <div className="space-y-4">
      <div className="w-full h-8 bg-gray-200 rounded-md animate-pulse"></div>
      <div className="w-full h-8 bg-gray-200 rounded-md animate-pulse"></div>
      <div className="w-full h-8 bg-gray-200 rounded-md animate-pulse"></div>
    </div>
  );
};

interface Collection {
  _id: string;
  name: string;
  bookIds: string[];
}

export default function BookCollections({ bookId }: { bookId: string }) {
  const { toast } = useToast();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [removingCollectionId, setRemovingCollectionId] = useState<
    string | null
  >(null);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch("/api/collections");
        const data = await res.json();
        setCollections(data);

        if (data.length > 0) {
          setSelectedCollection(data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
        toast({
          title: "Error",
          description: "Failed to load collections.",
          duration: 5000,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, [toast]);

  const handleAdd = async () => {
    if (!selectedCollection) {
      toast({
        title: "Error",
        description: "Please select a collection first.",
        duration: 5000,
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);
    try {
      const res = await fetch(`/api/collections/${selectedCollection}/books`, {
        method: "POST",
        body: JSON.stringify({ bookId }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setCollections(
          collections.map((collection) => {
            if (
              collection._id === selectedCollection &&
              !collection.bookIds.includes(bookId)
            ) {
              return {
                ...collection,
                bookIds: [...collection.bookIds, bookId],
              };
            }
            return collection;
          })
        );
        toast({
          title: "Success",
          description: "Book added to collection!",
          duration: 5000,
          variant: "add",
        });
      } else {
        const err = await res.json();
        toast({
          title: "Error",
          description: err.error || "Failed to add book.",
          duration: 5000,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while adding the book.",
        duration: 5000,
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemove = async (collectionId: string) => {
    setRemovingCollectionId(collectionId);
    try {
      const res = await fetch(
        `/api/collections/${collectionId}/books/${bookId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setCollections(
          collections.map((collection) => {
            if (collection._id === collectionId) {
              return {
                ...collection,
                bookIds: collection.bookIds.filter((id) => id !== bookId),
              };
            }
            return collection;
          })
        );
        toast({
          title: "Success",
          description: "Book removed from collection!",
          duration: 5000,
          variant: "remove",
        });
      } else {
        const err = await res.json();
        toast({
          title: "Error",
          description: err.error || "Failed to remove book.",
          duration: 5000,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while removing the book.",
        duration: 5000,
        variant: "destructive",
      });
    } finally {
      setRemovingCollectionId(null);
    }
  };

  return (
    <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium mb-4">Manage Collections</h3>

      {isLoading ? (
        <SkeletonLoader /> // Display skeleton loader when loading
      ) : collections.length === 0 ? (
        <p className="text-gray-500">
          You don&apos;t have any collections yet.
        </p>
      ) : (
        <>
          {/* Add to collection section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add to collection:
            </label>
            <div className="flex gap-2">
              <select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {collections.map((collection) => (
                  <option
                    key={collection._id}
                    value={collection._id}
                    disabled={collection.bookIds.includes(bookId)}
                  >
                    {collection.name}{" "}
                    {collection.bookIds.includes(bookId)
                      ? "(Already added)"
                      : ""}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAdd}
                disabled={
                  isAdding ||
                  collections
                    .find((c) => c._id === selectedCollection)
                    ?.bookIds.includes(bookId)
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? "Adding..." : "Add"}
              </button>
            </div>
          </div>

          {/* Current collections list */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Current collections:
            </h4>
            <ul className="divide-y divide-gray-200">
              {collections.filter((c) => c.bookIds.includes(bookId)).length >
              0 ? (
                collections
                  .filter((c) => c.bookIds.includes(bookId))
                  .map((collection) => (
                    <li
                      key={collection._id}
                      className="py-2 flex justify-between items-center"
                    >
                      <span className="text-sm">{collection.name}</span>
                      <button
                        onClick={() => handleRemove(collection._id)}
                        disabled={isAdding}
                        className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                      >
                        Remove
                      </button>
                    </li>
                  ))
              ) : (
                <li className="py-2 text-sm text-gray-500">
                  This book is not in any collection yet.
                </li>
              )}
            </ul>
          </div>
        </>
      )}
      <Toaster />
    </div>
  );
}
