"use client";
import React from "react";
import { Message } from "../../types";

interface MessageAlertProps {
  message: Message | null;
}

const MessageAlert: React.FC<MessageAlertProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div
        className={`p-4 rounded-lg ${
          message.type === "success"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default MessageAlert;