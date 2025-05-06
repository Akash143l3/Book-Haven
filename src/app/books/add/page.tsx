"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";

interface BookFormData {
  title: string;
  author: string;
  description: string;
  publishedDate: string;
  pageCount: string;
  genre: string;
  isbn: string;
  publisher: string;
  language: string;
  format: string;
  coverImage: string; // To store base64 image data
}

export default function AddBookPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    description: "",
    publishedDate: "",
    pageCount: "",
    genre: "",
    isbn: "",
    publisher: "",
    language: "",
    format: "Paperback",
    coverImage: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          coverImage: reader.result as string, // This will be the base64 string of the image
        }));
      };
      reader.readAsDataURL(file); // Read the file as a data URL (base64 string)
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.message || "Failed to add book");
      }

      toast({
        title: "Book added successfully!",
        description: "The new book has been saved to the library.",
        variant: "add",
      });
      router.push("/books");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Add New Book</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Author *
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="coverImage"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Cover Image
          </label>
          <input
            type="file"
            id="coverImage"
            name="coverImage"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formData.coverImage && (
            <div className="mt-4">
              <Image
                src={formData.coverImage}
                alt="Cover Preview"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="publishedDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Published Date
            </label>
            <input
              type="date"
              id="publishedDate"
              name="publishedDate"
              value={formData.publishedDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="pageCount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Page Count
            </label>
            <input
              type="number"
              id="pageCount"
              name="pageCount"
              value={formData.pageCount}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="genre"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Genre
            </label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="isbn"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ISBN
            </label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="publisher"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Publisher
            </label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Language
            </label>
            <input
              type="text"
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="format"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Format
            </label>
            <select
              id="format"
              name="format"
              value={formData.format}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Paperback">Paperback</option>
              <option value="Hardcover">Hardcover</option>
              <option value="E-book">E-book</option>
              <option value="Audiobook">Audiobook</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : "Save Book"}
          </button>
        </div>
      </form>
    </div>
  );
}
