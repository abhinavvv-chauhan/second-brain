import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";

// Define the API response interface (what comes from backend)
interface ApiContent {
    _id: string;
    title: string;
    link: string;
    tags: string[];
    userId: {
        _id: string;
        username: string;
    };
    __v: number;
}

// Define the Content interface (what we need in frontend)
interface Content {
    id: string;
    type: "twitter" | "youtube";
    link: string;
    title: string;
}

export function useContent(){
    const [contents, setContents] = useState<Content[]>([]); // Type the state

    // Function to determine content type from URL
    function getContentType(url: string): "twitter" | "youtube" {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return 'youtube';
        } else if (url.includes('twitter.com') || url.includes('x.com')) {
            return 'twitter';
        }
        // Default to youtube if can't determine
        return 'youtube';
    }

    function refresh(){
        axios.get(`${BACKEND_URL}/api/v1/content`,{
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
        .then((response) => {
            console.log("API Response:", response.data.content); // Debug log
            
            // Transform the API response to match our frontend interface
            const transformedContent: Content[] = response.data.content.map((item: ApiContent) => ({
                id: item._id,
                type: getContentType(item.link),
                link: item.link,
                title: item.title
            }));
            
            console.log("Transformed Content:", transformedContent); // Debug log
            setContents(transformedContent);
        })
        .catch((error) => {
            console.error("Error fetching content:", error); // Error handling
        })
    }
    
    useEffect(() => {
        refresh();
        let interval = setInterval(() => {
            refresh()
        }, 10 * 1000)

        return () => {
            clearInterval(interval)
        }
    },[])

    return {contents, refresh};
}