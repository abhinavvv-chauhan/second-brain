import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';

interface Content {
  id: string;
  title: string;
  type: string;
  link: string;
}

export function SharedBrainPage() {
  const { hash } = useParams<{ hash: string }>();
  const [username, setUsername] = useState('');
  const [contents, setContents] = useState<Content[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSharedContent = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/brain/${hash}`);
        setUsername(res.data.username);
        setContents(res.data.content);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Error loading shared brain');
      }
    };

    if (hash) {
      fetchSharedContent();
    }
  }, [hash]);

  if (error) {
    return <div className="p-8 text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{username}'s Shared Brain</h1>
      {contents.length === 0 ? (
        <p className="text-gray-600">No content found.</p>
      ) : (
        <ul className="space-y-4">
          {contents.map((content, idx) => (
            <li key={content.id || idx} className="border p-4 rounded bg-white shadow">
              <h2 className="font-semibold text-lg">{content.title}</h2>
              <p className="text-sm text-gray-600">{content.type}</p>
              <a href={content.link} className="text-indigo-500 text-sm break-words" target="_blank" rel="noopener noreferrer">
                {content.link}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
