"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

export default function EditBookForm({
  bookId,
  onSuccess,
}: {
  bookId: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    coverImage: "",
    publishedDate: "",
    pageCount: "",
    genre: "",
    isbn: "",
    publisher: "",
    language: "",
    format: "Paperback",
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${bookId}`);
        const data = await res.json();

        if (res.ok) {
          setFormData({
            title: data.title || "",
            author: data.author || "",
            description: data.description || "",
            coverImage: data.coverImage || "",
            publishedDate: data.publishedDate || "",
            pageCount: data.pageCount?.toString() || "",
            genre: data.genre || "",
            isbn: data.isbn || "",
            publisher: data.publisher || "",
            language: data.language || "",
            format: data.format || "Paperback",
          });

          setPreviewUrl(data.coverImage || null);
        } else {
          toast({ title: "Failed to load book", variant: "destructive" });
        }
      } catch (err) {
        toast({
          title: "Error fetching book",
          description: `${err}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const updatedData = {
          ...formData,
          coverImage: previewUrl || formData.coverImage,
        };

        const res = await fetch(`/api/books/${bookId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });

        if (res.ok) {
          toast({ title: "Book updated successfully", variant: "add" });
          onSuccess?.();
          window.location.reload();
        } else {
          toast({ title: "Failed to update book", variant: "destructive" });
        }
      } catch (err) {
        toast({
          title: "Error updating book",
          description: `${err}`,
          variant: "destructive",
        });
      }
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton loader */}
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-300 h-8 w-3/4 rounded"></div>{" "}
          {/* Title Skeleton */}
          <div className="bg-gray-300 h-8 w-3/4 rounded"></div>{" "}
          {/* Author Skeleton */}
          <div className="bg-gray-300 h-24 w-full rounded"></div>{" "}
          {/* Description Skeleton */}
          <div className="bg-gray-300 h-12 w-full rounded"></div>{" "}
          {/* Cover Image Skeleton */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-300 h-8 w-full rounded"></div>{" "}
            {/* Published Date Skeleton */}
            <div className="bg-gray-300 h-8 w-full rounded"></div>{" "}
            {/* Page Count Skeleton */}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-300 h-8 w-full rounded"></div>{" "}
            {/* Genre Skeleton */}
            <div className="bg-gray-300 h-8 w-full rounded"></div>{" "}
            {/* ISBN Skeleton */}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-300 h-8 w-full rounded"></div>{" "}
            {/* Publisher Skeleton */}
            <div className="bg-gray-300 h-8 w-full rounded"></div>{" "}
            {/* Language Skeleton */}
            <div className="bg-gray-300 h-8 w-full rounded"></div>{" "}
            {/* Format Skeleton */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Title *"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <InputField
            label="Author *"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          {previewUrl && (
            <div className="mt-4">
              <Image
                src={previewUrl}
                alt="Cover Preview"
                width={128}
                height={128}
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            type="date"
            label="Published Date"
            name="publishedDate"
            value={formData.publishedDate}
            onChange={handleChange}
          />
          <InputField
            type="number"
            label="Page Count"
            name="pageCount"
            value={formData.pageCount}
            onChange={handleChange}
            min={1}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
          />
          <InputField
            label="ISBN"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Publisher"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
          />
          <InputField
            label="Language"
            name="language"
            value={formData.language}
            onChange={handleChange}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Format
            </label>
            <select
              name="format"
              value={formData.format}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
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
            disabled={isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70"
          >
            {isPending ? "Saving..." : "Save Book"}
          </button>
        </div>
      </form>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  min,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  min?: number;
}) {
  return (
    <div>
      <label
        className="block text-sm font-medium text-gray-700 mb-1"
        htmlFor={name}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
