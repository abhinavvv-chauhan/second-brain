import { useState } from 'react';
import { Button } from './button';
import { LinkIcon } from '../../icons/LinkIcon';
import { CopyIcon } from '../../icons/CopyIcon';


interface ShareCardProps {
  url: string;
}

export function ShareCard({ url }: ShareCardProps) {
  const [showToast, setShowToast] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000); 
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy link.');
    }
  };

  return (
    <>
      <div className="mb-8 p-0.5 rounded-2xl bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 shadow-lg">
        <div className="bg-slate-800 rounded-[15px] p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="text-slate-500 flex-shrink-0">
              <LinkIcon/>
            </div>

            <div className="flex-grow text-center sm:text-left">
              <p className="font-bold text-slate-200 mb-1">Your Public Share Link</p>
              <p className="text-slate-400 font-mono text-sm break-all">{url}</p>
            </div>
            
            <div className="w-full sm:w-auto flex-shrink-0 mt-4 sm:mt-0">
              <Button
                variant="secondary"
                text="Copy Link"
                startIcon={<CopyIcon />}
                onClick={copyToClipboard}
                fullWidth={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-gray-900 text-white rounded-lg shadow-lg transition-all duration-300 
          ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        Copied to clipboard
      </div>
    </>
  );
}