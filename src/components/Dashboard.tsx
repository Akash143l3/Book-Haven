"use client";
import React, { useState } from "react";
import { BookOpen, User, AlertTriangle, CheckCircle, Plus, TrendingUp, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Book, BorrowedBook } from "../../types";

interface DashboardProps {
  books: Book[];
  borrowedBooks: BorrowedBook[];
  overdueBooks: BorrowedBook[];
  onViewChange: (view: "dashboard" | "borrow" | "borrowed" | "overdue") => void;
  isLoading?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  books,
  borrowedBooks,
  overdueBooks,
  onViewChange,
  isLoading = false,
}) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Check if data is still loading (either explicit loading prop or no books fetched yet)
  const isDataLoading = isLoading || (books.length === 0 && borrowedBooks.length === 0);
  
  // Check if individual data is still loading for stat cards
  const isBooksLoading = isLoading || books.length === 0;
  const isBorrowedBooksLoading = isLoading || borrowedBooks.length === 0;

  const statsCards = [
    {
      title: "Total Books",
      value: books.length,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Books in library",
      trend: "+12% from last month"
    },
    {
      title: "Currently Borrowed",
      value: borrowedBooks.filter((b) => b.status === "borrowed").length,
      icon: User,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Active borrowers",
      trend: "+8% from last month"
    },
    {
      title: "Overdue Books",
      value: overdueBooks.length,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Need attention",
      trend: "-5% from last month"
    },
    {
      title: "Total Returns",
      value: borrowedBooks.filter((b) => b.status === "returned").length,
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Books returned",
      trend: "+15% from last month"
    },
  ];

  const quickActions = [
    {
      label: "Borrow a New Book",
      description: "Add a new borrowing record",
      icon: Plus,
      color: "default",
      view: "borrow" as const,
    },
    {
      label: "View All Borrowed Books",
      description: "See all currently borrowed books",
      icon: BookOpen,
      color: "secondary",
      view: "borrowed" as const,
    },
    {
      label: "Check Overdue Books",
      description: "Review books past due date",
      icon: AlertTriangle,
      color: "destructive",
      view: "overdue" as const,
    },
  ];

  const handleActionClick = async (view: string, actionView: any) => {
    setLoadingAction(view);
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 500));
    onViewChange(actionView);
    setLoadingAction(null);
  };

  const getMostPopularGenre = () => {
    if (books.length === 0) return "Fiction";
    
    const genreCount = books.reduce((acc, book) => {
      const genre = book.genre || "Other";
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(genreCount).reduce((a, b) => 
      genreCount[a[0]] > genreCount[b[0]] ? a : b
    )[0];
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "borrowed":
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Borrowed</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      case "returned":
        return <Badge variant="secondary">Returned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Show loading state if data is still being fetched
  if (isDataLoading) {
    return (
      <div className="space-y-8">
        {/* Loading Header */}
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Loading Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20 mb-1" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Loading Recent Borrowed Books */}
          <Card className="animate-pulse">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-48" />
              </div>
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-start space-x-4">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                  {index < 2 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Loading Quick Actions */}
          <Card className="animate-pulse">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Loading Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(2)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-1" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Library Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening in your library today.
        </p>
      </div>

      {/* Alert for overdue books */}
      {overdueBooks.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            You have {overdueBooks.length} overdue book{overdueBooks.length > 1 ? 's' : ''} that need attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const isStatLoading = 
            (index === 0 && isBooksLoading) || // Total Books
            (index === 1 && isBorrowedBooksLoading) || // Currently Borrowed
            (index === 2 && isLoading) || // Overdue Books
            (index === 3 && isBorrowedBooksLoading); // Total Returns
          
          return (
            <Card key={index} className="transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {isStatLoading ? (
                  <>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-20 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span>{stat.trend}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Borrowed Books */}
        <Card>
  <CardHeader className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
    <div>
      <CardTitle className="flex items-center space-x-2">
        <BookOpen className="h-5 w-5" />
        <span>Recent Borrowed Books</span>
      </CardTitle>
      <CardDescription>
        Latest borrowing activity in your library
      </CardDescription>
    </div>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onViewChange("borrowed")}
      className="mt-2 lg:mt-0"
    >
      See All
    </Button>
  </CardHeader>

  <CardContent>
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500" />
        </div>
      ) : borrowedBooks.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No borrowed books yet</p>
        </div>
      ) : (
        borrowedBooks.slice(0, 3).map((borrowedBook, index) => {
          const book = books.find((b) => b._id === borrowedBook.bookId);
          return (
            <div key={borrowedBook._id}>
              <div className="flex justify-between items-start space-x-4">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
  {borrowedBook ? (
    borrowedBook.bookTitle
  ) : (
    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
  )}
</div>
<div className="text-sm text-muted-foreground">
  {borrowedBook ? (
    <>by {borrowedBook.bookAuthor}</>
  ) : (
    <div className="h-3 bg-gray-100 rounded w-24 animate-pulse" />
  )}
</div>

                  <div className="flex items-center space-x-2 mt-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {borrowedBook.borrowerName}
                    </span>
                    <Calendar className="h-3 w-3 text-muted-foreground ml-2" />
                    <span className="text-xs text-muted-foreground">
                      Due: {formatDate(borrowedBook.dueDate)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  {getStatusBadge(borrowedBook.status)}
                  {borrowedBook.status === "overdue" && (
                    <div className="flex items-center text-xs text-red-600">
                      <Clock className="h-3 w-3 mr-1" />
                      Overdue
                    </div>
                  )}
                </div>
              </div>
              {index < 2 && <Separator className="mt-4" />}
            </div>
          );
        })
      )}
    </div>
  </CardContent>
</Card>


        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and navigation shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                const isLoading = loadingAction === action.label;
                return (
                  <Button
                    key={index}
                    variant={action.color as any}
                    className="w-full justify-start h-20 p-4"
                    onClick={() => handleActionClick(action.label, action.view)}
                    disabled={isLoading}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                      <div className="text-left flex-1">
                        <div className="font-medium">{action.label}</div>
                        <div className="text-xs opacity-70 font-normal">
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Popular Genre</CardTitle>
          </CardHeader>
          <CardContent>
            {isBooksLoading ? (
              <>
                <Skeleton className="h-8 w-20 mb-1" />
                <Skeleton className="h-3 w-32" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-600">
                  {books.length > 0 ? getMostPopularGenre() : "Fiction"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Most borrowed category
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            {isBorrowedBooksLoading ? (
              <>
                <Skeleton className="h-8 w-20 mb-1" />
                <Skeleton className="h-3 w-32" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-purple-600">
                  {borrowedBooks.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total transactions
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
