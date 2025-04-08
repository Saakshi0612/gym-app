// src/components/auth/AuthFooter.tsx
import React from 'react';

type AuthFooterProps = {
  message: string;
  linkText: string;
  linkUrl: string;
};

export default function AuthFooter({ message, linkText, linkUrl }: AuthFooterProps) {
  return (
    <p className="mt-6 text-center text-sm">
      {message} <a href={linkUrl} className="font-lexend font-bold hover:underline">{linkText}</a>
    </p>
  );
}