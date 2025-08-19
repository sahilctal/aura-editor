# Architecture Documentation 🏗️

This document provides a comprehensive technical overview of Aura Editor's architecture, design decisions, and implementation patterns.

## 🎯 Architectural Overview

Aura Editor follows a **component-based React architecture** with custom hooks for specialized functionality. The application is built around a three-panel layout that promotes clear separation of concerns and intuitive user workflows.

### Core Architectural Pattern

**Component-Based Architecture with State Coordination**

```
┌─────────────┬─────────────────────┬─────────────────┐
│   Palette   │       Canvas        │   Properties    │
│   (20%)     │       (60%)         │     (20%)       │
│             │                     │                 │
│ Drag Source │   Drop Zone +       │ Property Editor │
│             │   Element Manager   │                 │
└─────────────┴─────────────────────┴─────────────────┘
```

## 🔧 Technology Stack & Justifications

### **React 18 + TypeScript**
**Choice**: React with functional components and TypeScript
**Justification**:
- **Component Reusability**: Modular UI components (Palette, Canvas, PropertiesPanel)
- **State Management**: Built-in React state for simple, predictable data flow
- **Type Safety**: TypeScript prevents runtime errors and improves developer experience
- **Hooks**: Enable clean state logic extraction (useHistory, component state)
- **Performance**: React's reconciliation handles efficient re-renders

### **Vite Build System**
**Choice**: Vite over Create React App or Webpack
**Justification**:
- **Fast Development**: Hot Module Replacement (HMR) for instant feedback
- **Modern Tooling**: Native ES modules and esbuild for speed
- **TypeScript Support**: Zero-config TypeScript compilation
- **Optimized Builds**: Rollup-based production bundling
- **Plugin Ecosystem**: Seamless integration with other tools

### **Tailwind CSS**
**Choice**: Tailwind over styled-components or CSS modules
**Justification**:
- **Rapid Prototyping**: Utility classes for quick UI development
- **Consistency**: Design system built into the framework
- **Bundle Size**: Purges unused styles in production
- **Responsive Design**: Built-in responsive utilities
- **Customization**: Easy theming and configuration

### **Native HTML5 Drag & Drop**
**Choice**: Native browser APIs over libraries like react-dnd
**Justification**:
- **Performance**: No additional JavaScript overhead
- **Browser Compatibility**: Standardized across all modern browsers
- **Simplicity**: Direct event handling without library abstractions
- **Bundle Size**: Reduces dependency footprint
- **Control**: Full control over drag behavior and styling

## 🏛️ System Architecture

### State Management Strategy

**React State + Custom History Hook**

The application uses a hybrid state management approach:

1. **Local Component State**: For component-specific UI state
2. **Lifted State**: App.tsx coordinates shared state between components
3. **Custom useHistory Hook**: Specialized undo/redo functionality
4. **localStorage**: Persistence layer for user data

```typescript
// State Distribution
App.tsx: {
  selectedElementId: string | null,
  selectedElement: DroppedElement | null
}

Canvas.tsx: {
  droppedElements: DroppedElement[],
  dragState: DragState,
  editingElementId: string | null,
  isPreviewModalOpen: boolean
}

useHistory: {
  history: T[],
  currentIndex: number
}
```

### Component Communication Patterns

#### **1. Parent-Child Props Flow**
- App → Palette: No props needed (stateless)
- App → Canvas: selectedElementId, onSelectElement callback
- App → PropertiesPanel: selectedElement, onPropertyChange callback

#### **2. Imperative API (ref-based)**
- App → Canvas: Property changes via exposed `handlePropertyChange` method
- Breaks circular dependency in property updates

#### **3. Event-Driven Communication**
- Palette → Canvas: HTML5 drag events with dataTransfer
- Canvas → App: Selection events with element data

### Data Flow Architecture

```
User Interaction → Component → State Update → Re-render → UI Update
     ↓               ↓           ↓             ↓          ↓
  Drag Element → Canvas → Update Elements → Render → Visual Feedback
  Select Element → Canvas → Notify App → Update Selection → Properties Panel
  Change Property → Properties → App → Canvas → Update Element → Re-render
```

## 🧩 Component Design Patterns

### **Separation of Concerns**

#### **Palette Component**
- **Single Responsibility**: Provide draggable component library
- **Stateless**: No internal state, pure rendering
- **Event Source**: Initiates drag operations

#### **Canvas Component**
- **Multiple Responsibilities** (justified by complexity):
  - Drop zone handling
  - Element positioning and rendering
  - Selection management
  - Inline editing
  - Persistence
  - History integration
- **State Container**: Manages primary application data
- **Event Handler**: Responds to drag, click, and keyboard events

#### **PropertiesPanel Component**
- **Single Responsibility**: Edit properties of selected elements
- **Controlled Component**: Receives state via props, communicates changes via callbacks
- **Type-Aware**: Renders different inputs based on element type

#### **PreviewModal Component**
- **Single Responsibility**: Preview and export functionality
- **Presentation Component**: Receives data, handles display logic
- **Feature Complete**: Self-contained modal with multiple view modes

### **Custom Hook Design**

#### **useHistory Hook**
```typescript
interface HistoryHook<T> {
  pushState: (state: T) => void;
  undo: () => T | null;
  redo: () => T | null;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;
}
```

**Design Decisions**:
- **Generic Type**: Works with any state type
- **Immutable**: Doesn't modify original states
- **Bounded**: Maximum 50 states for memory management
- **Simple API**: Easy to integrate and test

## 🔄 Undo/Redo Implementation

### **Design Approach**
**Custom History Stack** rather than libraries like Redux Undo

**Architecture**:
```
History Stack: [State1, State2, State3, State4, State5]
                                          ↑
                                    currentIndex
```

**Operations**:
- **Push**: Add new state, truncate future states if not at end
- **Undo**: Move currentIndex backward, return previous state
- **Redo**: Move currentIndex forward, return next state

**Integration Points**:
- Canvas element changes
- Property modifications
- Element additions/deletions
- Position updates

**Memory Management**:
- Maximum 50 states
- Circular buffer behavior
- Deep cloning of states to prevent mutations

## 🎨 Rendering Strategy

### **Element Rendering**
Each canvas element is rendered as an absolutely positioned component:

```typescript
// Dynamic positioning
style={{
  position: 'absolute',
  left: `${element.x}px`,
  top: `${element.y}px`,
  // ... other properties
}}
```

### **Type-Safe Property Handling**
Properties are handled differently based on element type:

```typescript
// Property parsing with type safety
const fontSize = typeof props.fontSize === 'string' 
  ? props.fontSize 
  : `${props.fontSize || 16}px`;
```

### **Responsive Preview**
HTML generation creates responsive layouts:

```typescript
// Desktop vs Mobile styling
const isMobile = previewMode === 'mobile';
const containerStyles = isMobile 
  ? 'max-width: 375px; margin: 0 auto;'
  : 'width: 100%;';
```

## 🔐 Type Safety Strategy

### **Centralized Type Definitions**
All types are defined in `src/types/index.ts` for:
- **Consistency**: Single source of truth
- **Reusability**: Shared across components
- **Maintainability**: Easy to update and extend

### **Key Type Patterns**

#### **Discriminated Unions**
```typescript
type ElementType = 'Text' | 'TextArea' | 'Image' | 'Button';

interface DroppedElement {
  type: ElementType;
  properties: ElementProperties; // Type varies by element type
}
```

#### **Generic Interfaces**
```typescript
interface HistoryHook<T> {
  pushState: (state: T) => void;
  // ... other methods
}
```

## 🚀 Performance Considerations

### **Efficient Re-rendering**
- **Selective Updates**: Only re-render affected components
- **Event Delegation**: Minimal event listeners
- **Memoization**: React.memo for expensive components (potential future optimization)

### **Memory Management**
- **History Bounds**: Limited to 50 states
- **Event Cleanup**: Proper event listener removal
- **State Normalization**: Flat element arrays for efficient updates

### **Bundle Optimization**
- **Tree Shaking**: Vite eliminates unused code
- **CSS Purging**: Tailwind removes unused styles
- **Native APIs**: No heavy drag/drop libraries

## 🧪 Testability Considerations

### **Pure Functions**
- HTML generation functions are pure and easily testable
- Property parsing utilities are isolated

### **Component Isolation**
- Each component has clear inputs/outputs
- State changes are predictable and traceable

### **Mock-Friendly**
- localStorage abstraction allows for easy mocking
- Event handling is encapsulated and mockable

## 🔮 Extensibility & Future Enhancements

### **Architecture Supports**:
- **New Element Types**: Add to ElementType union and property interfaces
- **Custom Properties**: Extend ElementProperties interface
- **Plugin System**: Component-based architecture allows for plugin integration
- **Theming**: Tailwind configuration enables easy theme customization
- **Collaboration**: State structure ready for real-time sync

### **Potential Improvements**:
- **Component Nesting**: Hierarchical element relationships
- **Advanced Layouts**: Grid and flexbox layout tools
- **Animation**: CSS transitions and animations
- **Templates**: Pre-built layout templates
- **Asset Management**: Image upload and management system

## 📊 Architecture Benefits

### **Developer Experience**
- **Fast Feedback**: Vite HMR for instant updates
- **Type Safety**: Catch errors at compile time
- **Clear Structure**: Easy to navigate and understand
- **Debugging**: React DevTools integration

### **User Experience**
- **Responsive**: Smooth interactions with native APIs
- **Reliable**: Auto-save prevents data loss
- **Intuitive**: Familiar drag-and-drop interactions
- **Fast**: Optimized bundle and efficient rendering

### **Maintainability**
- **Modular**: Components can be developed and tested independently
- **Documented**: Clear interfaces and type definitions
- **Extensible**: Easy to add new features
- **Scalable**: Architecture supports growing complexity

This architecture provides a solid foundation for a visual editor while maintaining simplicity, performance, and developer productivity.
