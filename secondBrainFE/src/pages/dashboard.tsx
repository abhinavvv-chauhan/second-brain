import { PlusIcon } from '../icons/PlusIcon';
import { Button } from '../components/ui/button';
import { ShareIcon } from '../icons/ShareIcon';
import { CreateContentModal } from '../components/ui/createContentModal';
import { useEffect, useState, lazy, Suspense, useMemo } from 'react';
import { Sidebar } from '../components/ui/sidebar';
import { Logo } from '../icons/Logo';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { ShareCard } from '../components/ui/shareCard';
import type { FilterType } from '../components/ui/sidebar';
import { useContent, type Content } from '../hooks/useContent';

const LazyCard = lazy(() =>
  import('../components/ui/card').then(module => ({ default: module.Card }))
);

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const { contents, refresh } = useContent();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const navigate = useNavigate();

  useEffect(() => {
    refresh();
  }, [modalOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const handleShare = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/brain/share`,
        { share: true },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setShareUrl(`${window.location.origin}/share/${response.data.hash}`);
    } catch (error) {
      console.error('Share error:', error);
      alert('Failed to generate share link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (contentId: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/content`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          contentId: contentId,
        },
      });
      refresh();
    } catch (err) {
      console.error("Failed to delete content:", err);
      alert("Error: Could not delete item.");
    }
  };

  const filteredContents = useMemo(() => {
    if (activeFilter === 'all') {
      return contents;
    }
    return contents.filter((content: Content) => content.type === activeFilter);
  }, [contents, activeFilter]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed left-0 top-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden`}
      >
        <Sidebar
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          onLogout={handleLogout}
        />
      </div>

      <div className="hidden lg:block">
        <Sidebar
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          onLogout={handleLogout}
        />
      </div>

      <div className="lg:ml-72">
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4 dark:bg-slate-900 dark:border-b-slate-800">
          <div className="flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="flex items-center">
              <div className="transform scale-110 mr-2"><Logo /></div>
              <h1 className="text-lg font-bold text-gray-800 dark:text-slate-200">Second Brain</h1>
            </div>
            <div className="w-10" />
          </div>
        </div>
        
        <div className="p-4 lg:p-8">
          <CreateContentModal open={modalOpen} onClose={() => setModalOpen(false)} />
          {shareUrl && <ShareCard url={shareUrl} />}

          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-200 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-slate-200">Your Second Brain</h2>
                  <p className="text-gray-600 dark:text-gray-400">Organize your thoughts, amplify your intelligence</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={() => setModalOpen(true)} variant="primary" text="Add Content" startIcon={<PlusIcon />} />
                  <Button onClick={handleShare} variant="secondary" text={isLoading ? 'Sharing...' : 'Share Brain'} startIcon={<ShareIcon />} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-200 dark:bg-slate-800 dark:border-slate-700">
            {filteredContents.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center dark:bg-slate-700">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-200 mb-2">
                  {contents.length > 0 ? `No ${activeFilter} content found` : 'No content yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {contents.length > 0 ? 'Try a different filter or add new content.' : 'Start by adding your first piece of content.'}
                </p>
                <Button onClick={() => setModalOpen(true)} variant="primary" text="Add Content" startIcon={<PlusIcon />} />
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-200 mb-2">Your Content ({filteredContents.length})</h3>
                  <p className="text-gray-600 dark:text-gray-400">All your saved knowledge in one place</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
                  <Suspense fallback={<div>Loading...</div>}>
                    {filteredContents.map(content => (
                      <LazyCard
                        key={content.id}
                        id={content.id}
                        type={content.type}
                        link={content.link}
                        title={content.title}
                        onDelete={handleDelete}
                      />
                    ))}
                  </Suspense>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
