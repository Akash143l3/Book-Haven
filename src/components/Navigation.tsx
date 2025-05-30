// components/Navigation.tsx
"use client";
import React from "react";
import { BookOpen, Calendar, User, Plus, AlertTriangle } from "lucide-react";

interface NavigationProps {
  currentView: string;
  onTabClick: (tabId: string) => void;
  isDesktop: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onTabClick,
  isDesktop,
}) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BookOpen },
    { id: "borrow", label: "Borrow Book", icon: Plus },
    { id: "borrowed", label: "Borrowed Books", icon: User },
    {
      id: "overdue",
      label: "Overdue Books",
      icon: AlertTriangle,
      isAlert: true,
    },
  ];

  if (isDesktop) {
    return (
      <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabClick(tab.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                currentView === tab.id
                  ? tab.isAlert
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden xl:inline">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="space-y-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabClick(tab.id)}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
              currentView === tab.id
                ? tab.isAlert
                  ? "bg-red-50 text-red-700 border-l-4 border-red-600"
                  : "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
