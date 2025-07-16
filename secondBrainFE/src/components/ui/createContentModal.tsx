import { useRef, useState } from "react";
import axios from "axios";
import { Button } from "./button";
import { Input } from "./input";
import { DeleteIcon } from "../../icons/DeleteIcon";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl p-5 w-full max-w-md mx-3">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold">Add Content</h2>
          <button onClick={onClose}>
            <DeleteIcon />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input reference={titleRef} placeholder="Enter title" />
          </div>

          <div>
            <label className="text-sm font-medium">Link</label>
            <Input reference={linkRef} placeholder="Enter link" />
          </div>

          <div>
            <label className="text-sm font-medium">Type</label>
            <div className="flex gap-2 mt-2">
              <Button
                text="Youtube"
                variant={type === ContentType.Youtube ? "primary" : "secondary"}
                onClick={() => setType(ContentType.Youtube)}
                fullWidth
              />
              <Button
                text="Twitter"
                variant={type === ContentType.Twitter ? "primary" : "secondary"}
                onClick={() => setType(ContentType.Twitter)}
                fullWidth
              />
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
