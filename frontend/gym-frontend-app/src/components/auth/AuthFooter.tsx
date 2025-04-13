// src/components/auth/AuthFooter.tsx

import { AuthFooterProps } from '../../types';


export default function AuthFooter({ message, linkText, linkUrl }: AuthFooterProps) {
  return (
    <p className="mt-6 text-center text-sm">
      {message} <a href={linkUrl} className="font-lexend font-bold underline">{linkText}</a>
    </p>
  );
}