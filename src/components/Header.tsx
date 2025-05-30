"use client";
import React from "react";
import { Menu, X } from "lucide-react";
import Navigation from "./Navigation";

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  currentView: string;
  onTabClick: (tabId: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  currentView,
  onTabClick,
}) => {
  return (
    <div className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 sm:py-6">
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:block">
            <Navigation
              currentView={currentView}
              onTabClick={onTabClick}
              isDesktop={true}
            />
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-2">
            <Navigation
              currentView={currentView}
              onTabClick={onTabClick}
              isDesktop={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;