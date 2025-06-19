import { useEffect } from "react";
import { ViewIcon } from "../../icons/ViewIcon";
import { CrossIcon } from "../../icons/CrossIcon";

interface CardProps {
  title: string;
  link: string;
  type: "twitter" | "youtube";
}

export function Card({ title, link, type }: CardProps) {
  useEffect(() => {
    if (type === "twitter") {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [type]);

  function getYouTubeVideoId(url) {
    // Just get the video ID from the URL
    if (url.includes('v=')) {
      return url.split('v=')[1].split('&')[0];
    }
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    return null;
  }

  const renderContent = () => {
    if (type === "youtube") {
      const videoId = getYouTubeVideoId(link);
      if (!videoId) return <div>Invalid YouTube URL</div>;
      
      return (
        <div className="w-full h-60">
          <iframe
            className="w-full h-full rounded"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      );
    }

    if (type === "twitter") {
      const twitterUrl = link.replace('x.com', 'twitter.com');
      return (
        <div className="w-full">
          <blockquote className="twitter-tweet">
            <a href={twitterUrl}></a>
          </blockquote>
        </div>
      );
    }

    return <div>Unsupported content type</div>;
  };

  return (
    <div className="border rounded-lg p-4 mt-8 ml-6 bg-white shadow-sm w-96">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <a href={link} target="_blank" rel="noopener noreferrer">
            <ViewIcon size="md" />
          </a>
          <CrossIcon/>
        </div>
      </div>
      
      {/* Content */}
      {renderContent()}
    </div>
  );
}