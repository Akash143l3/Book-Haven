"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"; // assumes Radix-like UI lib
import { Button } from "@/components/ui/button"; // styled button
import { toast } from "./ui/use-toast";
import EditBookForm from "./EditBookForm";

export default function BookActions({ bookId }: { bookId: string }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async () => {
    const res = await fetch(`/api/books/${bookId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast({ title: "Book deleted successfully.", variant: "destructive" });
      router.push("/books");
    } else {
      toast({ title: "Failed to delete the book.", variant: "destructive" });
    }
  };

  return (
    <div className="flex gap-6 pt-10 ">
      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Book</Button>
        </DialogTrigger>
        <DialogContent className="h-[80%]">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          <EditBookForm bookId={bookId} onSuccess={() => setEditOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive">Delete Book</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700">
            Are you sure you want to delete this book? This action cannot be
            undone.
          </p>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
