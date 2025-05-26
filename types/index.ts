export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  coverImage?: string;
  publishedDate: string;
  pageCount: number;
  genre: string;
  isbn?: string;
  publisher?: string;
  language?: string;
  format?: string;
  availableStock?:number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Collection {
  _id: string;
  name: string;
  description: string;
  userId: string;
  bookIds: string[];
  bookCount?: number;
  coverImage?: string;
  books?: Book[];
  createdAt?: Date;
  updatedAt?: Date;
}
