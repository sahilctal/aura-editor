import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import type { DroppedElement, ElementProperties, DragState } from '../types';
import PreviewModal from './PreviewModal';
import { useHistory } from '../hooks/useHistory';

interface CanvasElementProps {
  element: DroppedElement;
  isSelected: boolean;
  isEditing: boolean;
  onPositionChange: (id: string, x: number, y: number) => void;
  onDragStart: (elementId: string, startX: number, startY: number, offsetX: number, offsetY: number) => void;
  onSelect: (elementId: string) => void;
  onDoubleClick: (elementId: string) => void;
  onEditComplete: (elementId: string, property: string, value: string) => void;
  onEditCancel: () => void;
}

const CanvasElement: React.FC<CanvasElementProps> = ({ 
  element, 
  isSelected, 
  isEditing, 
  onPositionChange, 
  onDragStart, 
  onSelect, 
  onDoubleClick, 
  onEditComplete, 
  onEditCancel 
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [editValue, setEditValue] = useState('');

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isEditing) return; // Don't drag while editing
    
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering canvas drop events
    
    // Select the element first
    onSelect(element.id);
    
    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      onDragStart(element.id, e.clientX, e.clientY, offsetX, offsetY);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (element.type === 'Text' || element.type === 'TextArea') {
              const currentValue = element.type === 'Text' 
        ? element.properties?.text || element.properties?.textContent || 'Sample Text'
        : element.properties?.textAreaContent || 'Enter text...';
      setEditValue(currentValue);
      onDoubleClick(element.id);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && element.type === 'Text') {
      e.preventDefault();
      handleEditComplete();
    } else if (e.key === 'Enter' && e.shiftKey && element.type === 'TextArea') {
      // Allow Shift+Enter for new lines in TextArea
      return;
    } else if (e.key === 'Enter' && element.type === 'TextArea' && !e.shiftKey) {
      e.preventDefault();
      handleEditComplete();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onEditCancel();
    }
  };

  const handleEditComplete = () => {
    const property = element.type === 'Text' ? 'text' : 'textAreaContent';
    onEditComplete(element.id, property, editValue);
  };

  const handleEditBlur = () => {
    handleEditComplete();
  };

  const getElementContent = (type: string) => {
    const props = element.properties || {};
    
    switch (type) {
      case 'Text':
        if (isEditing) {
          return (
            <div 
              className="bg-blue-100 border border-blue-300 rounded px-3 py-2 min-w-[100px]"
              style={{
                backgroundColor: props.backgroundColor || '#dbeafe',
              }}
            >
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleEditKeyDown}
                onBlur={handleEditBlur}
                className="bg-transparent outline-none border-none w-full"
                style={{
                  fontSize: `${props.fontSize || 14}px`,
                  fontWeight: props.fontWeight || 'normal',
                  color: props.color || '#1e40af',
                  fontFamily: 'inherit'
                }}
                autoFocus
              />
            </div>
          );
        }
        return (
          <div 
            className="bg-blue-100 border border-blue-300 rounded px-3 py-2 min-w-[100px] cursor-move hover:bg-blue-200 transition-colors"
            style={{
              backgroundColor: props.backgroundColor || '#dbeafe',
            }}
            onDoubleClick={handleDoubleClick}
          >
            <span 
              className="text-blue-800"
              style={{
                fontSize: `${props.fontSize || 14}px`,
                fontWeight: props.fontWeight || 'normal',
                color: props.color || '#1e40af'
              }}
            >
{props.text || props.textContent || 'Sample Text'}
            </span>
          </div>
        );
      case 'TextArea':
        if (isEditing) {
          return (
            <textarea 
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKeyDown}
              onBlur={handleEditBlur}
              className="bg-green-100 border border-green-300 rounded p-2 resize-none outline-none"
              style={{
                width: typeof props.width === 'string' ? props.width : `${props.width || 120}px`,
                height: typeof props.height === 'string' ? props.height : `${props.height || 60}px`,
                backgroundColor: props.backgroundColor || '#dcfce7',
                fontFamily: 'inherit'
              }}
              placeholder={props.placeholder || 'Enter text here...'}
              autoFocus
            />
          );
        }
        return (
          <textarea 
            className="bg-green-100 border border-green-300 rounded p-2 resize-none cursor-move hover:bg-green-200 transition-colors"
            style={{
              width: typeof props.width === 'string' ? props.width : `${props.width || 120}px`,
              height: typeof props.height === 'string' ? props.height : `${props.height || 60}px`,
              backgroundColor: props.backgroundColor || '#dcfce7'
            }}
            placeholder={props.placeholder || 'Enter text here...'}
            value={props.textAreaContent || 'Sample textarea content'}
            onDoubleClick={handleDoubleClick}
            onMouseDown={(e) => e.stopPropagation()} // Allow text editing
            readOnly
          />
        );
      case 'Image':
        const imageUrl = props.src;
        return (
          <div 
            className="border border-purple-300 rounded cursor-move hover:border-purple-400 transition-colors overflow-hidden"
            style={{
              width: typeof props.width === 'string' ? props.width : `${props.width || 100}px`,
              height: typeof props.height === 'string' ? props.height : `${props.height || 100}px`,
              borderRadius: typeof props.borderRadius === 'string' ? props.borderRadius : `${props.borderRadius || 8}px`
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={props.alt || 'Image'}
                className="w-full h-full"
                style={{
                  objectFit: (props.objectFit as any) || 'cover'
                }}
              />
            ) : (
              <div className="bg-purple-100 w-full h-full flex items-center justify-center">
                <span className="text-purple-800 text-xs">🖼️ {props.alt || 'Image'}</span>
              </div>
            )}
          </div>
        );
            case 'Button':
        return (
          <button 
            className="border rounded px-4 py-2 cursor-move transition-colors"
            style={{
              backgroundColor: props.backgroundColor || '#3b82f6',
              color: props.color || '#ffffff',
              borderColor: props.backgroundColor || '#3b82f6'
            }}
            onClick={(e) => e.stopPropagation()} // Allow button click but still allow dragging
          >
            {props.text || props.buttonText || 'Click Me'}
          </button>
        );
      default:
        return (
          <div className="bg-gray-100 border border-gray-300 rounded p-2 cursor-move hover:bg-gray-200 transition-colors">
            {type}
          </div>
        );
    }
  };

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        userSelect: isEditing ? 'auto' : 'none',
        zIndex: isSelected ? 2 : 1
      }}
      className={`${isSelected ? 'ring-2 ring-blue-500 ring-opacity-75 rounded' : ''} ${
        isEditing ? 'ring-2 ring-green-500 ring-opacity-75 rounded' : ''
      }`}
    >
      {getElementContent(element.type)}
      {isEditing && (
        <div className="absolute -top-6 left-0 text-xs bg-green-100 text-green-700 px-2 py-1 rounded whitespace-nowrap">
          {element.type === 'Text' ? 'Press Enter to save, Esc to cancel' : 'Press Enter to save, Esc to cancel'}
        </div>
      )}
    </div>
  );
};

interface CanvasProps {
  selectedElementId?: string | null;
  onSelectElement?: (elementId: string | null, element?: DroppedElement | null) => void;
  onPropertyChange?: (elementId: string, property: string, value: any) => void;
}

const Canvas = forwardRef<
  { handlePropertyChange: (elementId: string, property: string, value: any) => void },
  CanvasProps
>(({ 
  selectedElementId, 
  onSelectElement,
  onPropertyChange 
}, ref) => {
  // Use history hook for undo/redo functionality
  const {
    state: droppedElements,
    setState: setDroppedElements,
    undo,
    redo,
    canUndo,
    canRedo,
    pushState: pushElementsState,
    clearHistory
  } = useHistory<DroppedElement[]>([], 50);

  const [isDragOver, setIsDragOver] = useState(false);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    elementId: null,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0
  });
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // localStorage key for persisting elements
  const STORAGE_KEY = 'aura-editor-elements';

  // Generate HTML from canvas elements  
  const generateHTML = (isMobile: boolean = false): string => {
    if (!droppedElements || droppedElements.length === 0) {
      return '<!-- No elements on canvas -->';
    }

    const generateElementHTML = (element: DroppedElement): string => {
      const props = element.properties || {};
      const commonStyles = `position: absolute; left: ${element.x}px; top: ${element.y}px;`;

      switch (element.type) {
        case 'Text':
          const textStyles = [
            commonStyles,
            `font-size: ${props.fontSize || 14}px;`,
            `font-weight: ${props.fontWeight || 'normal'};`,
            `color: ${props.color || '#1e40af'};`,
            `background-color: ${props.backgroundColor || '#dbeafe'};`,
            'padding: 12px 16px;',
            'border-radius: 6px;',
            'border: 1px solid #93c5fd;'
          ].join(' ');
          
          return `<div style="${textStyles}">${props.text || 'Sample Text'}</div>`;

        case 'TextArea':
          const textAreaStyles = [
            commonStyles,
            `width: ${typeof props.width === 'string' ? props.width : `${props.width || 120}px`};`,
            `height: ${typeof props.height === 'string' ? props.height : `${props.height || 60}px`};`,
            `background-color: ${props.backgroundColor || '#dcfce7'};`,
            'padding: 8px;',
            'border-radius: 6px;',
            'border: 1px solid #86efac;',
            'resize: none;',
            'font-family: inherit;'
          ].join(' ');
          
          return `<textarea style="${textAreaStyles}" placeholder="${props.placeholder || 'Enter text here...'}">${props.textAreaContent || 'Sample textarea content'}</textarea>`;

        case 'Image':
          const imgContainerStyles = [
            commonStyles,
            `width: ${typeof props.width === 'string' ? props.width : `${props.width || 100}px`};`,
            `height: ${typeof props.height === 'string' ? props.height : `${props.height || 100}px`};`,
            `border-radius: ${typeof props.borderRadius === 'string' ? props.borderRadius : `${props.borderRadius || 8}px`};`,
            'border: 1px solid #c084fc;',
            'overflow: hidden;'
          ].join(' ');

          if (props.imageUrl) {
            const imgStyles = [
              'width: 100%;',
              'height: 100%;',
              `object-fit: ${props.objectFit || 'cover'};`
            ].join(' ');
            return `<div style="${imgContainerStyles}"><img src="${props.imageUrl}" alt="${props.alt || 'Image'}" style="${imgStyles}" /></div>`;
          } else {
            const placeholderStyles = [
              'width: 100%;',
              'height: 100%;',
              'display: flex;',
              'align-items: center;',
              'justify-content: center;',
              'background-color: #f3e8ff;',
              'color: #7c3aed;',
              'font-size: 12px;'
            ].join(' ');
            return `<div style="${imgContainerStyles}"><div style="${placeholderStyles}">🖼️ ${props.alt || 'Image'}</div></div>`;
          }

        case 'Button':
          const buttonStyles = [
            commonStyles,
            `background-color: ${props.backgroundColor || '#3b82f6'};`,
            `color: ${props.color || '#ffffff'};`,
            `border: 1px solid ${props.backgroundColor || '#3b82f6'};`,
            'padding: 8px 16px;',
            'border-radius: 6px;',
            'cursor: pointer;',
            'font-family: inherit;'
          ].join(' ');
          
          return `<button style="${buttonStyles}">${props.text || 'Click Me'}</button>`;

        default:
          return `<div style="${commonStyles}padding: 8px; background-color: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px;">${element.type}</div>`;
      }
    };

    const elementsHTML = droppedElements
      .map(generateElementHTML)
      .join('\n    ');

    const containerWidth = isMobile ? 'max-width: 375px; margin: 0 auto;' : 'width: 100%;';
    const bodyPadding = isMobile ? 'padding: 10px;' : 'padding: 20px;';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Layout${isMobile ? ' - Mobile' : ' - Desktop'}</title>
    <style>
        body {
            margin: 0;
            ${bodyPadding}
            font-family: system-ui, -apple-system, sans-serif;
            position: relative;
            min-height: 100vh;
            background-color: #f9fafb;
            ${isMobile ? 'overflow-x: hidden;' : ''}
        }
        .canvas-container {
            position: relative;
            background-color: white;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            min-height: 400px;
            padding: 0;
            ${containerWidth}
            ${isMobile ? 'box-sizing: border-box;' : ''}
        }
        ${isMobile ? `
        /* Mobile-specific styles */
        @media (max-width: 768px) {
            body {
                padding: 5px;
            }
            .canvas-container {
                max-width: 100%;
                border-radius: 4px;
            }
        }` : ''}
    </style>
</head>
<body>
    <div class="canvas-container">
    ${elementsHTML}
    </div>
</body>
</html>`;
  };

  // Load elements from localStorage on component mount
  useEffect(() => {
    try {
      const savedElements = localStorage.getItem(STORAGE_KEY);
      if (savedElements) {
        const parsedElements: DroppedElement[] = JSON.parse(savedElements);
        if (parsedElements.length > 0) {
          // Clear history and set initial state from localStorage
          clearHistory();
        }
      }
    } catch (error) {
      console.warn('Failed to load elements from localStorage:', error);
    }
  }, [clearHistory]);

  // Save elements to localStorage whenever droppedElements changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(droppedElements));
    } catch (error) {
      console.warn('Failed to save elements to localStorage:', error);
    }
  }, [droppedElements]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        if (canUndo) {
          undo();
        }
      } else if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') || 
                 ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
        e.preventDefault();
        if (canRedo) {
          redo();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [canUndo, canRedo, undo, redo]);

  // Mouse event handlers for moving elements
  useEffect(() => {
    let hasMoved = false;
    let startPos = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      if (dragState.isDragging && dragState.elementId && canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const newX = e.clientX - canvasRect.left - dragState.offsetX;
        const newY = e.clientY - canvasRect.top - dragState.offsetY;
        
        // Keep element within canvas bounds
        const boundedX = Math.max(0, Math.min(newX, canvasRect.width - 100)); // Approximate element width
        const boundedY = Math.max(0, Math.min(newY, canvasRect.height - 50)); // Approximate element height
        
        // Track if element has actually moved
        if (!hasMoved) {
          const element = droppedElements?.find(el => el.id === dragState.elementId);
          if (element) {
            startPos = { x: element.x, y: element.y };
          }
          hasMoved = Math.abs(boundedX - startPos.x) > 2 || Math.abs(boundedY - startPos.y) > 2;
        }
        
        updateElementPosition(dragState.elementId, boundedX, boundedY);
      }
    };

    const handleMouseUp = () => {
      if (dragState.isDragging) {
        // Only save to history if element actually moved
        if (hasMoved) {
          pushElementsState(droppedElements);
        }
        
        setDragState(prev => ({
          ...prev,
          isDragging: false,
          elementId: null
        }));
        hasMoved = false;
      }
    };

    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, droppedElements, pushElementsState]);

  // Handle element selection
  const handleElementSelect = (elementId: string) => {
    const element = droppedElements?.find(el => el.id === elementId);
    if (onSelectElement) {
      onSelectElement(elementId, element);
    }
  };

  // Handle double-click for inline editing
  const handleElementDoubleClick = (elementId: string) => {
    setEditingElementId(elementId);
  };

  // Handle edit completion
  const handleEditComplete = (elementId: string, property: string, value: string) => {
    if (!droppedElements) return;
    
    const newElements = droppedElements.map(element => 
      element.id === elementId
        ? { 
            ...element, 
            properties: { 
              ...element.properties, 
              [property]: value 
            } 
          }
        : element
    );
    setDroppedElements(newElements);
    setEditingElementId(null);
  };

  // Handle edit cancellation
  const handleEditCancel = () => {
    setEditingElementId(null);
  };

  // Handle drag start for moving elements
  const handleElementDragStart = (elementId: string, startX: number, startY: number, offsetX: number, offsetY: number) => {
    setDragState({
      isDragging: true,
      elementId,
      startX,
      startY,
      offsetX,
      offsetY
    });
  };

  // Update element position
  const updateElementPosition = (id: string, x: number, y: number) => {
    if (!droppedElements) return;
    
    const clampedX = Math.max(0, x);
    const clampedY = Math.max(0, y);
    
    const newElements = droppedElements.map(element => 
      element.id === id 
        ? { ...element, x: clampedX, y: clampedY }
        : element
    );
    setDroppedElements(newElements);
  };

  // Get default properties for different element types
  const getDefaultProperties = (type: string) => {
    switch (type) {
      case 'Text':
        return { 
          text: 'Sample Text',
          fontSize: '16px',
          color: '#1e40af',
          fontWeight: 'normal'
        };
      case 'TextArea':
        return { 
          placeholder: 'Enter text...',
          width: '200px',
          height: '100px'
        };
      case 'Image':
        return { 
          src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPjE1MHgxMDA8L3RleHQ+PC9zdmc+',
          alt: 'Placeholder Image',
          width: '150px',
          height: '100px'
        };
      case 'Button':
        return { 
          text: 'Click Me',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          padding: '8px 16px',
          borderRadius: '4px'
        };
      default:
        return {};
    }
  };

  // Handle property changes  
  const handlePropertyChange = (elementId: string, property: string, value: any) => {
    if (!droppedElements) return;
    
    const newElements = droppedElements.map(element => 
      element.id === elementId
        ? { 
            ...element, 
            properties: { 
              ...element.properties, 
              [property]: value 
            } 
          }
        : element
    );
    setDroppedElements(newElements);
    
    // Save to history for undo/redo
    pushElementsState(newElements);
    
    // NOTE: Removed onPropertyChange callback to prevent infinite loop
    // since App.tsx now calls this method directly via ref
  };

  // Expose handlePropertyChange to parent via ref
  useImperativeHandle(ref, () => ({
    handlePropertyChange
  }));

  // Drag and drop handlers for adding new elements from palette
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!dragState.isDragging) { // Only allow drops when not moving elements
      e.preventDefault(); // Allow drop
      e.dataTransfer.dropEffect = 'copy';
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only set dragover to false if we're leaving the canvas entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!dragState.isDragging) { // Only allow drops when not moving elements
      e.preventDefault();
      setIsDragOver(false);

      // Get the component type from the drag data
      const componentType = e.dataTransfer.getData('text/plain');
      
      if (componentType) {
        // Get the canvas bounds to calculate relative position
        const canvasRect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, e.clientX - canvasRect.left);
        const y = Math.max(0, e.clientY - canvasRect.top);

        // Create a new element with unique ID and default properties
        const newElement: DroppedElement = {
          id: `${componentType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: componentType,
          x,
          y,
          properties: getDefaultProperties(componentType)
        };

        const newElements = [...(droppedElements || []), newElement];
        setDroppedElements(newElements);
        
        // Save state for undo/redo
        pushElementsState(newElements);
      }
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Canvas</h2>
        <div className="flex items-center gap-2">
          {/* Undo/Redo buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                canUndo 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
              title={canUndo ? 'Undo (Ctrl+Z)' : 'Nothing to undo'}
            >
              ↶ Undo
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                canRedo 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
              title={canRedo ? 'Redo (Ctrl+Y)' : 'Nothing to redo'}
            >
              ↷ Redo
            </button>
          </div>
          
          <>
            <div className="w-px h-4 bg-gray-300"></div>
            <button
              type="button"
              onClick={() => {
                console.log('Preview button clicked, setting modal open...');
                setIsPreviewModalOpen(true);
                console.log('Modal state should now be true');
              }}
              className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors font-medium"
            >
              👁️ Preview
            </button>
            {droppedElements && droppedElements.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setDroppedElements([]);
                }}
                className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
              >
                Clear All
              </button>
            )}
          </>
          {droppedElements && droppedElements.length > 0 && (
            <span className="text-xs text-gray-500">
              Auto-saved to localStorage
            </span>
          )}
        </div>
      </div>
      
      <div
        ref={canvasRef}
        className={`relative bg-white rounded-lg border-2 ${
          isDragOver 
            ? 'border-blue-400 border-dashed bg-blue-50' 
            : 'border-gray-200'
        } ${dragState.isDragging ? 'cursor-grabbing' : ''} transition-colors duration-200`}
        style={{ 
          height: 'calc(100% - 4rem)',
          minHeight: '400px'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={(e) => {
          // Deselect when clicking on empty canvas and stop editing
          if (e.target === e.currentTarget) {
            if (onSelectElement) {
              onSelectElement(null, null);
            }
            if (editingElementId) {
              setEditingElementId(null);
            }
          }
        }}
      >
        {/* Drop zone hint */}
        {(!droppedElements || droppedElements.length === 0) && !isDragOver && !dragState.isDragging && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-400 text-center">
              Drag components from the palette to add them here
              <br />
              <span className="text-sm">Components will be positioned where you drop them</span>
              <br />
              <span className="text-xs text-gray-300 mt-2">Once added, you can drag elements around to reposition them</span>
              <br />
              <span className="text-xs text-gray-300 mt-1">Double-click Text or TextArea elements to edit inline</span>
            </p>
          </div>
        )}

        {/* Active drag over indicator */}
        {isDragOver && !dragState.isDragging && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-blue-600 font-medium">
              Drop component here
            </p>
          </div>
        )}

        {/* Moving element indicator */}
        {dragState.isDragging && (
          <div className="absolute top-2 left-2 text-xs text-gray-600 bg-yellow-100 px-2 py-1 rounded border">
            Moving element...
          </div>
        )}

        {/* Render all dropped elements */}
        {droppedElements && droppedElements.map(element => (
          <CanvasElement 
            key={element.id} 
            element={element}
            isSelected={selectedElementId === element.id}
            isEditing={editingElementId === element.id}
            onPositionChange={updateElementPosition}
            onDragStart={handleElementDragStart}
            onSelect={handleElementSelect}
            onDoubleClick={handleElementDoubleClick}
            onEditComplete={handleEditComplete}
            onEditCancel={handleEditCancel}
          />
        ))}
        
        {/* Element count indicator */}
        {droppedElements && droppedElements.length > 0 && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded border">
            {droppedElements.length} element{droppedElements.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        htmlContent={generateHTML(false)}
        mobileHtmlContent={generateHTML(true)}
      />
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;
