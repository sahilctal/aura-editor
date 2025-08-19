import React from 'react';

interface PaletteItemProps {
  name: string;
  icon: string;
}

const PaletteItem: React.FC<PaletteItemProps> = ({ name, icon }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Set the data being dragged - in this case, the component type
    e.dataTransfer.setData('text/plain', name);
    e.dataTransfer.effectAllowed = 'copy';
    
    // Add a visual indication that the item is being dragged
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    // Reset the opacity when drag ends
    e.currentTarget.style.opacity = '1';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="flex items-center p-3 mb-2 bg-gray-50 border border-gray-200 rounded-lg cursor-grab hover:bg-gray-100 transition-colors duration-200 active:cursor-grabbing"
      style={{ userSelect: 'none' }}
    >
      <span className="text-xl mr-3">{icon}</span>
      <span className="text-sm font-medium text-gray-700">{name}</span>
    </div>
  );
};

const Palette: React.FC = () => {
  const components = [
    { name: 'Text', icon: '📝' },
    { name: 'TextArea', icon: '📄' },
    { name: 'Image', icon: '🖼️' },
    { name: 'Button', icon: '🔘' }
  ];

  return (
    <div className="h-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Components</h2>
      <div className="space-y-2">
        <p className="text-xs text-gray-500 mb-3">Drag items to the canvas</p>
        {components.map((component) => (
          <PaletteItem
            key={component.name}
            name={component.name}
            icon={component.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default Palette;

