import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="py-2">
      <main className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          About Book Haven
        </h1>
        <section className="text-lg text-gray-600 mb-8">
          <p className="mb-4">
            <strong>Book Haven</strong> is a digital library management system
            designed to help you easily organize, track, and enjoy your personal
            book collection. Whether you're an avid reader or a book enthusiast,
            our platform provides the tools to maintain a well-organized
            library.
          </p>
          <p className="mb-4">
            We believe in the joy of reading and the importance of keeping your
            book collection accessible. With <strong>Book Haven</strong>, you
            can easily manage your books, create collections, categorize by
            genre, and search for titles with just a few clicks.
          </p>
          <p>
            Our mission is to simplify the process of managing your library so
            you can spend more time reading and less time searching for books.
          </p>
        </section>

        <section className="bg-gray-100 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Features
          </h2>
          <ul className="space-y-4 text-gray-600">
            <li>📚 Organize your collection by author, genre, and more.</li>
            <li>🔍 Search and filter books with ease.</li>
            <li>📅 Keep track of your reading progress.</li>
            <li>
              📂 Create personalized collections for your favorite genres.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Our Team
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            At <strong>Book Haven</strong>, we're a passionate team of book
            lovers dedicated to providing an exceptional digital library
            experience. Our team works hard to ensure that every feature is
            intuitive, fast, and easy to use.
          </p>
          <p className="text-lg text-gray-600">
            Join us today and start organizing your books in the most efficient
            way possible.
          </p>
        </section>
      </main>
    </div>
  );
}
