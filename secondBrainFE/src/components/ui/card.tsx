import { useEffect } from "react";
import { ViewIcon } from "../../icons/ViewIcon";
import { DeleteIcon } from "../../icons/DeleteIcon";

interface CardProps {
  id: string;
  title: string;
  link: string;
  type: "twitter" | "youtube";
  onDelete: (id: string) => void;
}

export function Card({ id, title, link, type, onDelete }: CardProps) {
  useEffect(() => {
    if (type === "twitter") {
      //@ts-ignore
      window.twttr?.widgets.load();
    }
  }, [type, link]);

  function getYouTubeVideoId(url: string): string | null {
    let videoId: string | null = null;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === "www.youtube.com") {
        videoId = urlObj.searchParams.get("v");
      } else if (urlObj.hostname === "youtu.be") {
        videoId = urlObj.pathname.slice(1);
      }
    } catch (e) {
      console.error("Invalid URL for YouTube parsing", e);
    }
    return videoId;
  }

  const renderContent = () => {
    if (type === "youtube") {
      const videoId = getYouTubeVideoId(link);
      if (!videoId) return <div className="text-red-500">Invalid YouTube URL</div>;
      
      return (
        <div className="aspect-video w-full">
          <iframe
            className="w-full h-full rounded-md"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }

    if (type === "twitter") {
      const twitterUrl = link.replace('x.com', 'twitter.com');
      return (
        <div className="w-full">
          <blockquote className="twitter-tweet" data-theme="dark">
            <a href={twitterUrl}></a>
          </blockquote>
        </div>
      );
    }

    return <div>Unsupported content type</div>;
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-4 dark:bg-slate-800 dark:border-slate-700">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-800 truncate pr-2 dark:text-slate-200">{title}</span>
        <div className="flex items-center gap-3 flex-shrink-0 text-gray-500 dark:text-gray-400">
          <a href={link} target="_blank" rel="noopener noreferrer" aria-label="View original content" className="hover:text-gray-800 dark:hover:text-white transition-colors">
            <ViewIcon size="md" />
          </a>
          <button 
            onClick={() => onDelete(id)} 
            aria-label="Delete content" 
            className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
      
      <div className="w-full h-full flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
}
