import { ToastProvider } from "@/components/ui/toast";
import Navbar from "../components/Navbar";
import "./globals.css";
import { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import { startDailyFineUpdates } from '@/lib/cronJobs';

// Call this when your app starts
if (process.env.NODE_ENV === 'production') {
  startDailyFineUpdates();
}

export const metadata: Metadata = {
  title: "Book Haven - Digital Library Management",
  description: "Manage your personal book collection with Book Haven",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <Navbar />

          {children}
          <footer className="bg-gray-800 text-white py-12 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Book Haven</h3>
                  <p className="text-gray-400">
                    Your personal digital library management system.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/" className="text-gray-400 hover:text-white">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/books"
                        className="text-gray-400 hover:text-white"
                      >
                        Books
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/collections"
                        className="text-gray-400 hover:text-white"
                      >
                        Collections
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about"
                        className="text-gray-400 hover:text-white"
                      >
                        About
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Contact</h3>
                  <p className="text-gray-400">
                    Email: info@bookhaven.com
                    <br />
                    Phone: (123) 456-7890
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
                <p>
                  &copy; {new Date().getFullYear()} Book Haven. All rights
                  reserved.
                </p>
              </div>
            </div>
          </footer>
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
