import './App.css'
import { useState, useRef } from 'react'
import Palette from './components/Palette'
import Canvas from './components/Canvas'
import PropertiesPanel from './components/PropertiesPanel'
import type { DroppedElement } from './types'

function App() {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<DroppedElement | null>(null);
  const canvasRef = useRef<{ handlePropertyChange: (elementId: string, property: string, value: any) => void } | null>(null);

  const handleSelectElement = (elementId: string | null, element?: DroppedElement | null) => {
    setSelectedElementId(elementId);
    setSelectedElement(element || null);
  };

  const handlePropertyChange = (elementId: string, property: string, value: any) => {
    // Update the selected element if it's the one being changed
    if (selectedElement && selectedElement.id === elementId) {
      setSelectedElement(prev => prev ? {
        ...prev,
        properties: { ...prev.properties, [property]: value }
      } : null);
    }
    
    // Forward the property change to Canvas component
    if (canvasRef.current) {
      canvasRef.current.handlePropertyChange(elementId, property, value);
    }
  };

  return (
    <div 
      className="flex h-screen bg-gray-100" 
      style={{ 
        display: 'flex', 
        height: '100vh', 
        backgroundColor: '#f3f4f6' 
      }}
    >
      {/* Left Panel - Palette (20% width) */}
      <div 
        className="w-1/5 bg-white border-r border-gray-300 p-4"
        style={{ 
          width: '20%', 
          backgroundColor: 'white', 
          borderRight: '1px solid #d1d5db', 
          padding: '1rem' 
        }}
      >
        <Palette />
      </div>

      {/* Middle Panel - Canvas (60% width) */}
      <div 
        className="w-3/5 bg-gray-50 p-4"
        style={{ 
          width: '60%', 
          backgroundColor: '#f9fafb', 
          padding: '1rem' 
        }}
      >
        <Canvas 
          ref={canvasRef}
          selectedElementId={selectedElementId}
          onSelectElement={handleSelectElement}
        />
      </div>

      {/* Right Panel - Properties Panel (20% width) */}
      <div 
        className="w-1/5 bg-white border-l border-gray-300 p-4"
        style={{ 
          width: '20%', 
          backgroundColor: 'white', 
          borderLeft: '1px solid #d1d5db', 
          padding: '1rem' 
        }}
      >
        <PropertiesPanel
          selectedElement={selectedElement}
          onPropertyChange={handlePropertyChange}
        />
      </div>
    </div>
  )
}

export default App
