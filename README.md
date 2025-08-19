# Aura Editor 🎨

**Aura Editor** is a modern, no-code visual editor built with React, TypeScript, and Vite. It empowers users to create web layouts through an intuitive drag-and-drop interface, real-time property editing, and instant preview capabilities.

![Aura Editor](https://img.shields.io/badge/React-18.x-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Vite](https://img.shields.io/badge/Vite-7.x-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-3.x-cyan)

## ✨ Core Features

### 🎯 **Component Palette**
- Pre-built draggable components: Text, TextArea, Image, Button
- Intuitive drag-and-drop interface using native HTML5 APIs
- Visual feedback during drag operations

### 🖼️ **Freeform Canvas**
- Drop components anywhere on the canvas with pixel-perfect positioning
- Move elements around freely with mouse drag
- Click to select elements for property editing
- Visual indicators for selected and hovered elements

### ⚙️ **Properties Panel**
- Real-time property editing for selected elements
- Component-specific properties:
  - **Text**: fontSize, fontWeight, color, background
  - **TextArea**: width, height, placeholder, background
  - **Image**: URL, alt text, dimensions, border radius, object fit
  - **Button**: text, color, background, dimensions
- Instant visual updates on the canvas

### 💾 **Persistence & History**
- **localStorage Integration**: Automatically saves your work
- **Undo/Redo System**: Up to 50 actions with keyboard shortcuts (Ctrl+Z / Ctrl+Y)
- **Auto-restore**: Recovers your work when you reload the page

### 👀 **Preview & Export**
- **Visual Preview**: See exactly how your layout will look
- **Mobile/Desktop Modes**: Preview responsive behavior
- **HTML Export**: Generate clean HTML with inline styles
- **Copy to Clipboard**: Export your layouts for use elsewhere

### ✏️ **Inline Editing**
- **Double-click to Edit**: Text and TextArea elements become editable in-place
- **Keyboard Shortcuts**: Enter to save, Esc to cancel
- **No External Dependencies**: Uses native browser editing capabilities

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (LTS version 18.x or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd aura-editor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### 4. Start Building!

1. **Drag Components**: From the left Palette to the Canvas
2. **Position Elements**: Click and drag to move them around
3. **Edit Properties**: Select an element and use the Properties Panel on the right
4. **Preview Your Work**: Click the "👁️ Preview" button to see the final result
5. **Export**: Switch to "📄 HTML Code" mode and copy your generated HTML

## 🏗️ Build & Deploy

### Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

### Deploy

The `dist/` folder can be deployed to any static hosting service like:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `dist/` folder
- **GitHub Pages**: Configure with GitHub Actions
- **Any CDN**: Upload the `dist/` contents

## 🎯 Usage Examples

### Creating a Simple Layout

1. Drag a **Text** component to the canvas
2. Select it and change the text in Properties Panel
3. Drag an **Image** component below it
4. Set the image URL and adjust dimensions
5. Add a **Button** and customize its appearance
6. Preview your layout and export the HTML

### Responsive Design

1. Create your layout on desktop mode
2. Click "👁️ Preview" → "📱 Mobile (375px)" to see mobile version
3. Adjust element dimensions as needed for mobile responsiveness

## 🛠️ Development

### Project Structure

```
aura-editor/
├── src/
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   └── App.tsx             # Main application component
├── public/                 # Static assets
└── docs/                   # Documentation files
```

### Key Technologies

- **React 18**: Component-based UI framework
- **TypeScript**: Type safety and developer experience
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **HTML5 Drag & Drop**: Native browser APIs for interactions

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web standards and best practices
- Inspired by visual builders like Webflow and Framer
- Uses native browser APIs for optimal performance

---

**Happy Building!** 🚀 Create beautiful layouts with Aura Editor's intuitive visual interface.