import { PlusIcon } from '../icons/PlusIcon'
import { Button } from '../components/ui/button'
import { ShareIcon } from '../icons/ShareIcon'
import { CreateContentModal } from '../components/ui/createContentModal'
import { useEffect, useState, lazy, Suspense } from 'react'
import { Sidebar } from '../components/ui/sidebar'
import { useContent } from '../hooks/useContent'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../icons/Logo'
import axios from 'axios'
import { BACKEND_URL } from '../config'
import { ShareCard } from '../components/ui/shareCard';

// Lazy load components
const LazyCard = lazy(() => 
  import('../components/ui/card').then(module => ({ default: module.Card }))
);

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const {contents, refresh} = useContent();
  const navigate = useNavigate();

  useEffect(() => {
    refresh();
  }, [modalOpen])

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const handleShare = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
        share: true
      }, {
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      });
      setShareUrl(`http://localhost:5173/share/${response.data.hash}`);
    } catch (error) {
      console.error("Share error:", error);
      alert("Failed to generate share link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile Only */}
      <div className={`fixed left-0 top-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:hidden`}>
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <Sidebar />
          </div>
          
          {/* Mobile Logout Button */}
          <div className="p-6 border-t border-gray-100">
            <Button
              variant="secondary"
              text="Logout"
              onClick={handleLogout}
              fullWidth={true}
              startIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              }
            />
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
        {/* Desktop Logout Button */}
        <div className="fixed bottom-6 left-6 w-60">
          <Button
            variant="secondary"
            text="Logout"
            onClick={handleLogout}
            fullWidth={true}
            startIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72 min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center">
              <div className="transform scale-110 mr-2">
                <Logo />
              </div>
              <h1 className="text-lg font-bold text-gray-800">Second Brain</h1>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-8">
          <CreateContentModal open={modalOpen} onClose={() => {
            setModalOpen(false);
          }} />

          {shareUrl && <ShareCard url={shareUrl} />}

          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                    Your Second Brain
                  </h2>
                  <p className="text-gray-600">
                    Organize your thoughts, amplify your intelligence
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => setModalOpen(true)} 
                    variant="primary" 
                    text="Add Content" 
                    startIcon={<PlusIcon />}
                  />
                  <Button 
                    onClick={handleShare}
                    variant="secondary" 
                    text={isLoading ? "Sharing..." : "Share Brain"}
                    startIcon={<ShareIcon />}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-200">
            {contents.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No content yet</h3>
                <p className="text-gray-600 mb-6">Start building your second brain by adding your first piece of content.</p>
                <Button 
                  onClick={() => setModalOpen(true)} 
                  variant="primary" 
                  text="Add Your First Content" 
                  startIcon={<PlusIcon />}
                />
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Your Content ({contents.length})
                  </h3>
                  <p className="text-gray-600">
                    All your saved knowledge in one place
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <Suspense fallback={
                    Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
                        <div className="bg-gray-200 rounded h-4 mb-2"></div>
                        <div className="bg-gray-200 rounded h-3 w-2/3"></div>
                      </div>
                    ))
                  }>
                    {contents.map((content, index) => (
                      <LazyCard 
                        key={content.id || `${content.link}-${index}`} 
                        type={content.type}
                        link={content.link}
                        title={content.title}
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