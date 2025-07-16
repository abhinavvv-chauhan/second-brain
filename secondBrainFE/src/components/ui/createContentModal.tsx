import { useRef, useState } from "react";
import axios from "axios";
import { Button } from "./button";
import { Input } from "./input";
import { CrossIcon } from "../../icons/crossIcon"; 

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

//@ts-ignore
enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter"
}

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateContentModal({ open, onClose }: CreateContentModalProps) {
  const titleRef = useRef<HTMLInputElement>();
  const linkRef = useRef<HTMLInputElement>();
  const [type, setType] = useState(ContentType.Youtube);
  const [loading, setLoading] = useState(false);

  async function handleAddContent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;

    if (!title || !link) {
      alert("Please enter both title and link");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/v1/content`, {
          title,
          link,
          type
      }, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
          }
      });
      onClose();
    } catch (err) {
      alert("Something went wrong");
    }
    setLoading(false);
  }

  if (!open) return null;

  const selectedTypeStyle = "bg-blue-600 text-white";
  const unselectedTypeStyle = "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl p-5 w-full max-w-md mx-3 dark:bg-slate-800 dark:border dark:border-slate-700">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold dark:text-slate-200">Add Content</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
            <CrossIcon />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium dark:text-slate-300">Title</label>
            <Input reference={titleRef} placeholder="Enter title" />
          </div>

          <div>
            <label className="text-sm font-medium dark:text-slate-300">Link</label>
            <Input reference={linkRef} placeholder="Enter link" />
          </div>

          <div>
            <label className="text-sm font-medium dark:text-slate-300 mb-2 block">Type</label>
            <div className="flex rounded-lg p-1 bg-gray-100 dark:bg-slate-900">
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors duration-200 ${type === ContentType.Youtube ? selectedTypeStyle : unselectedTypeStyle}`}
                onClick={() => setType(ContentType.Youtube)}
              >
                Youtube
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors duration-200 ${type === ContentType.Twitter ? selectedTypeStyle : unselectedTypeStyle}`}
                onClick={() => setType(ContentType.Twitter)}
              >
                Twitter
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button text="Cancel" variant="secondary" onClick={onClose} fullWidth />
          <Button
            text={loading ? "Adding..." : "Add Content"}
            variant="primary"
            onClick={handleAddContent}
            fullWidth
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
