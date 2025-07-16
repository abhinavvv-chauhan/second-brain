import { useEffect, useState, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { Logo } from '../icons/Logo';
import type { Content } from '../hooks/useContent';

const LazyCard = lazy(() =>
  import('../components/ui/card').then(module => ({ default: module.Card }))
);

export function SharedBrainPage() {
  const { hash } = useParams<{ hash: string }>();
  const [username, setUsername] = useState('');
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!hash) {
      setLoading(false);
      setError('No share link provided.');
      return;
    }

    const fetchSharedContent = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/brain/${hash}`);
        setUsername(res.data.username);
        const transformedContent = res.data.content.map((item: any) => ({
          ...item,
          id: item._id,
        }));
        setContents(transformedContent);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Could not load this Second Brain.');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedContent();
  }, [hash]);

  const handlePublicDeleteAttempt = () => {
    if (showToast) return; 
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const renderSkeleton = () => (
    Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="animate-pulse bg-slate-700 rounded-lg h-64"></div>
    ))
  );

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="p-4 sm:p-6 border-b bg-slate-900/50 backdrop-blur-sm border-b-slate-800">
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-slate-200">
          <Logo />
          <h1 className="text-xl font-bold">
            {loading ? 'Loading Brain...' : `${username}'s Second Brain`}
          </h1>
        </div>
      </header>

      <main className="p-4 sm:p-8 max-w-7xl mx-auto">
        {!error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
            {loading ? renderSkeleton() : (
              contents.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <h2 className="text-2xl font-bold text-slate-200">This brain is empty.</h2>
                  <p className="text-gray-400 mt-2">There is no content to display.</p>
                </div>
              ) : (
                <Suspense fallback={renderSkeleton()}>
                  {contents.map((content) => (
                    <LazyCard
                      key={content.id}
                      id={content.id}
                      type={content.type}
                      link={content.link}
                      title={content.title}
                      onDelete={handlePublicDeleteAttempt}
                    />
                  ))}
                </Suspense>
              )
            )}
          </div>
        )}
        {error && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-red-500">An Error Occurred</h2>
            <p className="text-gray-400 mt-2">{error}</p>
          </div>
        )}
      </main>

      <div
        className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-gray-900 text-white rounded-lg shadow-lg transition-all duration-300 pointer-events-none ${
          showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        You cannot delete someone else's brain!
      </div>
    </div>
  );
}