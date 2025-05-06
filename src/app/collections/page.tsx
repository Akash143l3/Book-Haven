"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Collection } from "../../../types";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageBase64, setCoverImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  // Get the user ID from your authentication method
  // This should be replaced with how you're handling authentication in your app
  const [userId, setUserId] = useState<string>("");

  // Fetch the current user's ID when the component mounts
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Replace this with your actual auth method (e.g., from cookies, JWT, etc.)
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const userData = await res.json();
          if (userData?.user?.id) {
            setUserId(userData.user.id);
          }
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Function to convert image file to base64
  const convertImageToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/collections");

      if (!res.ok) {
        throw new Error(`Failed to fetch collections: ${res.status}`);
      }

      const data = await res.json();

      // Ensure we're working with an array
      if (Array.isArray(data)) {
        setCollections(data);
      } else if (data && typeof data === "object" && "collections" in data) {
        // Handle case where API returns { collections: [...] }
        setCollections(Array.isArray(data.collections) ? data.collections : []);
      } else {
        console.error("Unexpected API response format:", data);
        setCollections([]);
        setError("Unexpected data format received from server");
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
      setError("Failed to load collections");
      setCollections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      let finalCoverImage = coverImageBase64;

      // Convert image to Base64 if selected
      if (coverImage) {
        finalCoverImage = await convertImageToBase64(coverImage);
      }

      const data = {
        name,
        description,
        coverImage: finalCoverImage ?? "",
        userId: userId,
        bookIds: [],
        // Don't include _id field - MongoDB will generate it automatically
      };

      const res = await fetch("/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`Failed to create collection: ${res.status}`);
      }

      setName("");
      setDescription("");
      setCoverImage(null);
      setCoverImageBase64(null);
      setShowModal(false);
      toast({ title: "Collection created successfully!" });
      fetchCollections();
    } catch (error) {
      console.error("Error creating collection:", error);
      toast({
        title: "Failed to create collection",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Collections</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create New Collection
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Collections Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gray-400 rounded-full"></div>
                </div>
                <div className="p-4">
                  <div className="w-3/4 h-4 bg-gray-400 rounded mb-2"></div>
                  <div className="w-1/2 h-4 bg-gray-400 rounded"></div>
                </div>
              </div>
            ))
        ) : collections.length > 0 ? (
          collections.map((collection) => (
            <Link href={`/collections/${collection._id}`} key={collection._id}>
              <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                  {collection.coverImage ? (
                    <Image
                      src={collection.coverImage}
                      alt={collection.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-gray-400">No cover image</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{collection.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {collection.bookCount || 0} books
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500 mb-4">No collections found</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create your first collection
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">New Collection</h2>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Collection name"
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCoverImage(e.target.files ? e.target.files[0] : null)
              }
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
