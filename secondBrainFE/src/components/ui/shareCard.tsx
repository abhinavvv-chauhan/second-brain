// src/components/ui/ShareCard.tsx
import { useState } from 'react';

interface ShareCardProps {
  url: string;
}

export function ShareCard({ url }: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="mb-6 p-4 border border-indigo-200 rounded-xl bg-indigo-50 shadow">
      <p className="text-gray-700 mb-2 font-medium">Your Share Link:</p>
      <div className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm border">
        <span className="truncate text-indigo-600 font-mono text-sm max-w-xs">
          {url}
        </span>
        <button
          onClick={copyToClipboard}
          className="ml-4 text-sm cursor-pointer text-indigo-600 hover:underline"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

export default ShareCard;
