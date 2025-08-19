# Project Structure 📁

This document provides a comprehensive overview of the Aura Editor project structure, explaining the purpose and responsibility of each folder and key file.

## 📂 Root Directory

```
aura-editor/
├── src/                    # Source code
├── public/                 # Static assets
├── dist/                   # Production build output (generated)
├── node_modules/           # Dependencies (generated)
├── package.json            # Project configuration and dependencies
├── package-lock.json       # Dependency lock file
├── tsconfig.json           # TypeScript configuration
├── tsconfig.node.json      # TypeScript config for Node.js tools
├── vite.config.ts          # Vite build tool configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration for Tailwind
├── index.html              # Main HTML template
├── README.md               # Project documentation
├── PROJECT_STRUCTURE.md    # This file
└── ARCHITECTURE.md         # Technical architecture documentation
```

## 🎯 Source Code Structure (`src/`)

### Core Application

```
src/
├── App.tsx                 # Main application component
├── App.css                 # Global application styles
├── index.css               # Global CSS with Tailwind imports
├── main.tsx                # Application entry point
├── vite-env.d.ts          # Vite type definitions
├── components/             # React components
├── hooks/                  # Custom React hooks
└── types/                  # TypeScript type definitions
```

### 🧩 Components Directory (`src/components/`)

**Core UI Components:**

- **`Palette.tsx`**
  - **Purpose**: Left sidebar component palette
  - **Responsibility**: Displays draggable UI components (Text, TextArea, Image, Button)
  - **Features**: Native HTML5 drag events, visual feedback
  - **Exports**: `Palette` component

- **`Canvas.tsx`**
  - **Purpose**: Main design area and drop zone
  - **Responsibility**: 
    - Handles drop operations from palette
    - Manages element positioning and selection
    - Implements element movement with mouse events
    - Manages localStorage persistence
    - Provides undo/redo functionality
  - **Features**: 
    - Drag & drop handling
    - Element rendering and interaction
    - Inline editing for Text/TextArea
    - Auto-save to localStorage
    - Visual selection indicators
  - **Exports**: `Canvas` component with `forwardRef` for imperative API

- **`PropertiesPanel.tsx`**
  - **Purpose**: Right sidebar for editing element properties
  - **Responsibility**: 
    - Renders property inputs based on selected element type
    - Handles real-time property updates
    - Provides type-specific property controls
  - **Features**: 
    - Dynamic property forms
    - Real-time updates
    - Input validation and parsing
  - **Exports**: `PropertiesPanel` component

- **`PreviewModal.tsx`**
  - **Purpose**: Modal for previewing and exporting layouts
  - **Responsibility**: 
    - Displays visual preview of canvas
    - Provides HTML code export
    - Handles mobile/desktop preview modes
  - **Features**: 
    - Visual and code preview modes
    - Responsive preview switching
    - HTML export with clipboard copy
    - Desktop/Mobile layout modes
  - **Exports**: `PreviewModal` component

### 🎣 Hooks Directory (`src/hooks/`)

- **`useHistory.ts`**
  - **Purpose**: Custom hook for undo/redo functionality
  - **Responsibility**: 
    - Manages history stack (max 50 states)
    - Provides undo/redo operations
    - Tracks current history position
  - **Features**: 
    - State history management
    - Undo/redo with bounds checking
    - History clearing
    - Current state tracking
  - **Exports**: `useHistory` hook with `{ pushState, undo, redo, canUndo, canRedo, clearHistory }`

### 📝 Types Directory (`src/types/`)

- **`index.ts`**
  - **Purpose**: Centralized TypeScript type definitions
  - **Responsibility**: 
    - Defines core data structures
    - Ensures type safety across components
    - Provides shared interfaces
  - **Key Types**:
    - `DroppedElement`: Canvas element structure
    - `ElementProperties`: Properties for different element types
    - Component-specific property interfaces
  - **Exports**: All type definitions for the application

## 📄 Configuration Files

### **`package.json`**
- Project metadata and dependencies
- NPM scripts for development and building
- Project version and description

### **`tsconfig.json`**
- TypeScript compiler configuration
- Path resolution and module settings
- Strict type checking rules

### **`vite.config.ts`**
- Vite build tool configuration
- Development server settings
- Build optimization options

### **`tailwind.config.js`**
- Tailwind CSS configuration
- Content paths for purging
- Theme customization

### **`postcss.config.js`**
- PostCSS configuration for CSS processing
- Tailwind CSS plugin integration
- Autoprefixer configuration

## 🌊 Data Flow

### Component Hierarchy
```
App.tsx
├── Palette.tsx
├── Canvas.tsx
│   ├── CanvasElement (internal)
│   └── PreviewModal.tsx
└── PropertiesPanel.tsx
```

### State Management
- **App.tsx**: Manages selected element state and coordinates between components
- **Canvas.tsx**: Manages canvas elements array and editing state
- **useHistory.ts**: Manages undo/redo history stack
- **localStorage**: Persists canvas elements between sessions

### Key Data Structures

**DroppedElement**:
```typescript
interface DroppedElement {
  id: string;
  type: 'Text' | 'TextArea' | 'Image' | 'Button';
  x: number;
  y: number;
  properties: ElementProperties;
}
```

**ElementProperties**:
Dynamic properties based on element type (text, src, width, height, color, etc.)

## 🔄 Communication Patterns

1. **Palette → Canvas**: Drag events with element type data
2. **Canvas → App**: Selection events with element data
3. **App → PropertiesPanel**: Selected element for editing
4. **PropertiesPanel → App → Canvas**: Property changes via callbacks
5. **Canvas → PreviewModal**: HTML generation for preview
6. **useHistory**: Captures canvas state changes for undo/redo

## 🚀 Build Pipeline

1. **Development**: Vite dev server with HMR
2. **Type Checking**: TypeScript compilation
3. **CSS Processing**: Tailwind CSS via PostCSS
4. **Bundling**: Vite rollup-based bundling
5. **Output**: Optimized static files in `dist/`

This structure promotes:
- **Separation of Concerns**: Each component has a single responsibility
- **Type Safety**: TypeScript definitions ensure data integrity
- **Reusability**: Custom hooks and shared types
- **Maintainability**: Clear organization and documentation
- **Performance**: Efficient state management and minimal re-renders
