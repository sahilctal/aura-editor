import React from 'react';
import type { DroppedElement, ElementProperties } from '../types';

interface PropertiesPanelProps {
  selectedElement: DroppedElement | null;
  onPropertyChange: (elementId: string, property: string, value: any) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  selectedElement, 
  onPropertyChange 
}) => {
  if (!selectedElement) {
    return (
      <div className="h-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Properties</h2>
        <div className="text-center text-gray-500 mt-8">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-sm">Select an element on the canvas to edit its properties</p>
        </div>
      </div>
    );
  }

  const handlePropertyChange = (property: string, value: any) => {
    onPropertyChange(selectedElement.id, property, value);
  };

  const renderTextProperties = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Text Content</label>
        <input
          type="text"
          value={selectedElement.properties?.text || 'Sample Text'}
          onChange={(e) => handlePropertyChange('text', e.target.value)}
          className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
        <input
          type="number"
          value={parseInt(selectedElement.properties?.fontSize?.toString().replace('px', '')) || 16}
          onChange={(e) => handlePropertyChange('fontSize', `${e.target.value}px`)}
          className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          min="8"
          max="72"
        />
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Font Weight</label>
        <select
          value={selectedElement.properties?.fontWeight || 'normal'}
          onChange={(e) => handlePropertyChange('fontWeight', e.target.value)}
          className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="lighter">Light</option>
          <option value="600">Semi Bold</option>
        </select>
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Text Color</label>
        <input
          type="color"
          value={selectedElement.properties?.color?.toString() || '#000000'}
          onChange={(e) => handlePropertyChange('color', e.target.value)}
          className="w-full h-8 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderImageProperties = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Image URL</label>
        <input
          type="text"
          value={selectedElement.properties?.src || ''}
          onChange={(e) => handlePropertyChange('src', e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Alt Text</label>
        <input
          type="text"
          value={selectedElement.properties?.alt || 'Image'}
          onChange={(e) => handlePropertyChange('alt', e.target.value)}
          className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Object Fit</label>
        <select
          value={selectedElement.properties?.objectFit || 'cover'}
          onChange={(e) => handlePropertyChange('objectFit', e.target.value)}
          className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="fill">Fill</option>
          <option value="scale-down">Scale Down</option>
        </select>
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Border Radius (px)</label>
        <input
          type="number"
          value={parseInt(selectedElement.properties?.borderRadius?.toString().replace('px', '')) || 8}
          onChange={(e) => handlePropertyChange('borderRadius', `${e.target.value}px`)}
          className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          min="0"
          max="50"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Width (px)</label>
          <input
            type="number"
            value={parseInt(selectedElement.properties?.width?.toString().replace('px', '')) || 150}
            onChange={(e) => handlePropertyChange('width', `${e.target.value}px`)}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            min="50"
            max="500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Height (px)</label>
          <input
            type="number"
            value={parseInt(selectedElement.properties?.height?.toString().replace('px', '')) || 100}
            onChange={(e) => handlePropertyChange('height', `${e.target.value}px`)}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            min="50"
            max="500"
          />
        </div>
      </div>
    </div>
  );

  const renderTextAreaProperties = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Content</label>
        <textarea
          value={selectedElement.properties?.textAreaContent || 'Sample textarea content'}
          onChange={(e) => handlePropertyChange('textAreaContent', e.target.value)}
          rows={3}
          className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Placeholder</label>
        <input
          type="text"
          value={selectedElement.properties?.placeholder || 'Enter text here...'}
          onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
          className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Width (px)</label>
          <input
            type="number"
            value={parseInt(selectedElement.properties?.width?.toString().replace('px', '')) || 200}
            onChange={(e) => handlePropertyChange('width', `${e.target.value}px`)}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            min="80"
            max="400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Height (px)</label>
          <input
            type="number"
            value={parseInt(selectedElement.properties?.height?.toString().replace('px', '')) || 100}
            onChange={(e) => handlePropertyChange('height', `${e.target.value}px`)}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            min="40"
            max="200"
          />
        </div>
      </div>
    </div>
  );

  const renderButtonProperties = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Button Text</label>
        <input
          type="text"
          value={selectedElement.properties?.text || 'Click Me'}
          onChange={(e) => handlePropertyChange('text', e.target.value)}
          className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Text Color</label>
        <input
          type="color"
          value={selectedElement.properties?.color?.toString() || '#ffffff'}
          onChange={(e) => handlePropertyChange('color', e.target.value)}
          className="w-full h-8 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Background Color</label>
        <input
          type="color"
          value={selectedElement.properties?.backgroundColor?.toString() || '#3b82f6'}
          onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
          className="w-full h-8 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderProperties = () => {
    switch (selectedElement.type) {
      case 'Text':
        return renderTextProperties();
      case 'Image':
        return renderImageProperties();
      case 'TextArea':
        return renderTextAreaProperties();
      case 'Button':
        return renderButtonProperties();
      default:
        return <p className="text-gray-500 text-sm">No properties available for this element type.</p>;
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Properties</h2>
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
          {selectedElement.type}
        </span>
      </div>
      
      <div className="space-y-4">
        {/* Element Info */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <h3 className="text-xs font-medium text-gray-700 mb-2">Element Info</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <div>ID: {selectedElement.id.split('-')[0]}...</div>
            <div>Position: ({Math.round(selectedElement.x)}, {Math.round(selectedElement.y)})</div>
          </div>
        </div>

        {/* Properties */}
        <div>
          <h3 className="text-xs font-medium text-gray-700 mb-3">Properties</h3>
          {renderProperties()}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
