"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type BookType = {
  _id: string;
  title: string;
  author: string;
  coverImage?: string;
};

export default function CollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<BookType[]>([]);
  const [collection, setCollection] = useState<any>(null);

  const { toast } = useToast();
  const params = useParams();
  const id = params?.id;

  const fetchCollections = useCallback(async () => {
    try {
      const res = await fetch("/api/collections");
      const data = await res.json();
      setCollections(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching collections:", error);
      setLoading(false);
    }
  }, []);

  const fetchCollection = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/collections/${id}`);
      const data = await res.json();
      setCollection(data);
    } catch (error) {
      console.error("Error fetching single collection:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchCollections();
    fetchCollection();
  }, [fetchCollections, fetchCollection]);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }

    setLoading(true);
    const res = await fetch("/api/collections", {
      method: "POST",
      body: JSON.stringify({ name, description, coverImage }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setLoading(false);
    if (res.ok) {
      setName("");
      setDescription("");
      setCoverImage("");
      setShowModal(false);
      toast({ title: "Collection created successfully!" });
      fetchCollections();
    } else {
      toast({
        title: "Failed to create collection",
        variant: "destructive",
      });
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

      {/* Collections Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array(6)
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
          : collections.map((collection) => (
              <Link
                href={`/collections/${collection._id}`}
                key={collection._id}
              >
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
            ))}
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
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Cover image URL (optional)"
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
