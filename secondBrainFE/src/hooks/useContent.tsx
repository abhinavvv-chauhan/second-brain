import { useState, useCallback, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface ApiContent {
    _id: string;
    title: string;
    link: string;
}

export interface Content {
    id: string;
    type: "twitter" | "youtube";
    link: string;
    title: string;
}

export function useContent() {
    const [contents, setContents] = useState<Content[]>([]);

    function getContentType(url: string): "twitter" | "youtube" {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return 'youtube';
        } else if (url.includes('twitter.com') || url.includes('x.com')) {
            return 'twitter';
        }
        return 'youtube';
    }

    const refresh = useCallback(async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            const transformedContent: Content[] = response.data.content.map((item: ApiContent) => ({
                id: item._id,
                type: getContentType(item.link),
                link: item.link,
                title: item.title
            }));
            
            setContents(transformedContent);
        } catch (error) {
            console.error("Error fetching content:", error);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { contents, refresh };
}
