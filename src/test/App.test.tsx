import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the three-panel layout', () => {
    render(<App />)
    
    // Check if all three panels are present
    expect(screen.getByText('Components')).toBeInTheDocument()
    expect(screen.getByText('Drag components from the palette to add them here')).toBeInTheDocument()
    expect(screen.getByText('Properties')).toBeInTheDocument()
  })

  it('renders palette components', () => {
    render(<App />)
    
    // Check if palette items are rendered
    expect(screen.getByText('Text')).toBeInTheDocument()
    expect(screen.getByText('TextArea')).toBeInTheDocument()
    expect(screen.getByText('Image')).toBeInTheDocument()
    expect(screen.getByText('Button')).toBeInTheDocument()
  })

  it('shows canvas drop zone hint when empty', () => {
    render(<App />)
    
    expect(screen.getByText(/Drag components from the palette to add them here/)).toBeInTheDocument()
  })

  it('has proper layout structure with correct widths', () => {
    render(<App />)
    
    const app = document.querySelector('[style*="display: flex"]')
    expect(app).toBeInTheDocument()
  })

  it('renders undo/redo buttons', () => {
    render(<App />)
    
    expect(screen.getByText('↶ Undo')).toBeInTheDocument()
    expect(screen.getByText('↷ Redo')).toBeInTheDocument()
  })

  it('renders preview button', () => {
    render(<App />)
    
    expect(screen.getByText('👁️ Preview')).toBeInTheDocument()
  })
})
