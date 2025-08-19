import React, { useState } from 'react';

type PreviewMode = 'desktop' | 'mobile';
type ViewMode = 'visual' | 'code';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
  mobileHtmlContent: string;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, htmlContent, mobileHtmlContent }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [viewMode, setViewMode] = useState<ViewMode>('visual');

  const getCurrentHtmlContent = () => {
    return previewMode === 'desktop' ? htmlContent : mobileHtmlContent;
  };

  const handleCopy = async () => {
    const contentToCopy = getCurrentHtmlContent();
    try {
      await navigator.clipboard.writeText(contentToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = contentToCopy;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  console.log('PreviewModal render - isOpen:', isOpen);
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-[50vw] h-[50vh] max-w-[600px] max-h-[600px] min-w-[400px] min-h-[400px] overflow-hidden flex flex-col"
        style={{ backgroundColor: 'white', borderRadius: '8px' }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Canvas Preview</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 flex flex-col flex-1 overflow-hidden">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('visual')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    viewMode === 'visual'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  👁️ Visual
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('code')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    viewMode === 'code'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📄 HTML Code
                </button>
              </div>
              
              {/* Device Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    previewMode === 'desktop'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  🖥️ Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    previewMode === 'mobile'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📱 Mobile (375px)
                </button>
              </div>
            </div>
            
            {viewMode === 'code' && (
              <button
                type="button"
                onClick={handleCopy}
                className={`px-4 py-2 rounded transition-colors ${
                  copySuccess
                    ? 'bg-green-100 text-green-600 border border-green-300'
                    : 'bg-blue-100 text-blue-600 border border-blue-300 hover:bg-blue-200'
                }`}
              >
                {copySuccess ? (
                  <>
                    <span className="mr-1">✓</span>
                    Copied!
                  </>
                ) : (
                  <>
                    <span className="mr-1">📋</span>
                    Copy {previewMode === 'desktop' ? 'Desktop' : 'Mobile'} HTML
                  </>
                )}
              </button>
            )}
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-hidden border border-gray-200 rounded-lg">
            {viewMode === 'visual' ? (
              /* Visual Preview */
              <div className="h-full overflow-auto bg-white">
                <div 
                  className={`p-2 h-full ${previewMode === 'mobile' ? 'max-w-[375px] mx-auto' : 'w-full'}`}
                  style={{ 
                    minHeight: '100%',
                    transform: 'scale(0.8)',
                    transformOrigin: 'top left',
                    width: previewMode === 'mobile' ? '375px' : '125%'
                  }}
                >
                  <div 
                    dangerouslySetInnerHTML={{ __html: getCurrentHtmlContent() }}
                    className="w-full h-full"
                  />
                </div>
              </div>
            ) : (
              /* Code Preview */
              <pre className="h-full overflow-auto p-3 text-xs bg-gray-50 font-mono">
                <code className="text-gray-800 whitespace-pre-wrap">
                  {getCurrentHtmlContent()}
                </code>
              </pre>
            )}
          </div>

          {/* Stats */}
          <div className="mt-4 text-xs text-gray-500 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>
                Mode: {viewMode === 'visual' ? 'Visual Preview' : 'HTML Code'}
              </span>
              {viewMode === 'code' && (
                <>
                  <span>
                    Size: {new Blob([getCurrentHtmlContent()]).size} bytes
                  </span>
                  <span>
                    Lines: {getCurrentHtmlContent().split('\n').length}
                  </span>
                </>
              )}
            </div>
            <div className="text-xs text-gray-400">
              {previewMode === 'desktop' ? 'Desktop layout' : 'Mobile layout (375px)'}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-3 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
