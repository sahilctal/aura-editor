import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PropertiesPanel from '../components/PropertiesPanel'
import type { DroppedElement } from '../types'

const mockTextElement: DroppedElement = {
  id: 'text-1',
  type: 'Text',
  x: 100,
  y: 50,
  properties: {
    text: 'Sample Text',
    fontSize: '16px',
    fontWeight: 'normal',
    color: '#000000',
  },
}

const mockImageElement: DroppedElement = {
  id: 'image-1',
  type: 'Image',
  x: 200,
  y: 100,
  properties: {
    src: 'test-image.jpg',
    alt: 'Test Image',
    width: '150px',
    height: '100px',
    borderRadius: '8px',
  },
}

const mockButtonElement: DroppedElement = {
  id: 'button-1',
  type: 'Button',
  x: 300,
  y: 150,
  properties: {
    text: 'Click Me',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
  },
}

describe('PropertiesPanel Component', () => {
  const mockOnPropertyChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title and description', () => {
    render(<PropertiesPanel selectedElement={null} onPropertyChange={mockOnPropertyChange} />)
    
    expect(screen.getByText('Properties')).toBeInTheDocument()
    expect(screen.getByText('Select an element on the canvas to edit its properties')).toBeInTheDocument()
  })

  it('shows message when no element is selected', () => {
    render(<PropertiesPanel selectedElement={null} onPropertyChange={mockOnPropertyChange} />)
    
    expect(screen.getByText('Select an element on the canvas to edit its properties')).toBeInTheDocument()
  })

  it('renders text element properties', () => {
    render(<PropertiesPanel selectedElement={mockTextElement} onPropertyChange={mockOnPropertyChange} />)
    
    expect(screen.getByText('Text Properties')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Sample Text')).toBeInTheDocument()
    expect(screen.getByDisplayValue('16')).toBeInTheDocument() // fontSize without px
    expect(screen.getByDisplayValue('#000000')).toBeInTheDocument()
  })

  it('renders image element properties', () => {
    render(<PropertiesPanel selectedElement={mockImageElement} onPropertyChange={mockOnPropertyChange} />)
    
    expect(screen.getByText('Image')).toBeInTheDocument() // Element type badge
    expect(screen.getByDisplayValue('test-image.jpg')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Image')).toBeInTheDocument()
    expect(screen.getByDisplayValue('150')).toBeInTheDocument() // width without px
    expect(screen.getByDisplayValue('100')).toBeInTheDocument() // height without px
  })

  it('renders button element properties', () => {
    render(<PropertiesPanel selectedElement={mockButtonElement} onPropertyChange={mockOnPropertyChange} />)
    
    expect(screen.getByText('Button')).toBeInTheDocument() // Element type badge
    expect(screen.getByDisplayValue('Click Me')).toBeInTheDocument()
    expect(screen.getByDisplayValue('#3b82f6')).toBeInTheDocument()
    expect(screen.getByDisplayValue('#ffffff')).toBeInTheDocument()
  })

  it('calls onPropertyChange when text is modified', () => {
    render(<PropertiesPanel selectedElement={mockTextElement} onPropertyChange={mockOnPropertyChange} />)
    
    const textInput = screen.getByDisplayValue('Sample Text')
    fireEvent.change(textInput, { target: { value: 'Updated Text' } })
    
    expect(mockOnPropertyChange).toHaveBeenCalledWith('text-1', 'text', 'Updated Text')
  })

  it('calls onPropertyChange when fontSize is modified', () => {
    render(<PropertiesPanel selectedElement={mockTextElement} onPropertyChange={mockOnPropertyChange} />)
    
    const fontSizeInput = screen.getByDisplayValue('16')
    fireEvent.change(fontSizeInput, { target: { value: '20' } })
    
    expect(mockOnPropertyChange).toHaveBeenCalledWith('text-1', 'fontSize', '20px')
  })

  it('calls onPropertyChange when color is modified', () => {
    render(<PropertiesPanel selectedElement={mockTextElement} onPropertyChange={mockOnPropertyChange} />)
    
    const colorInput = screen.getByDisplayValue('#000000')
    fireEvent.change(colorInput, { target: { value: '#ff0000' } })
    
    expect(mockOnPropertyChange).toHaveBeenCalledWith('text-1', 'color', '#ff0000')
  })

  it('calls onPropertyChange when image URL is modified', () => {
    render(<PropertiesPanel selectedElement={mockImageElement} onPropertyChange={mockOnPropertyChange} />)
    
    const urlInput = screen.getByDisplayValue('test-image.jpg')
    fireEvent.change(urlInput, { target: { value: 'new-image.jpg' } })
    
    expect(mockOnPropertyChange).toHaveBeenCalledWith('image-1', 'src', 'new-image.jpg')
  })

  it('calls onPropertyChange when button text is modified', () => {
    render(<PropertiesPanel selectedElement={mockButtonElement} onPropertyChange={mockOnPropertyChange} />)
    
    const buttonTextInput = screen.getByDisplayValue('Click Me')
    fireEvent.change(buttonTextInput, { target: { value: 'New Button Text' } })
    
    expect(mockOnPropertyChange).toHaveBeenCalledWith('button-1', 'text', 'New Button Text')
  })

  it('handles font weight changes', () => {
    render(<PropertiesPanel selectedElement={mockTextElement} onPropertyChange={mockOnPropertyChange} />)
    
    const fontWeightSelect = screen.getByDisplayValue('normal')
    fireEvent.change(fontWeightSelect, { target: { value: 'bold' } })
    
    expect(mockOnPropertyChange).toHaveBeenCalledWith('text-1', 'fontWeight', 'bold')
  })

  it('parses numeric inputs correctly', () => {
    render(<PropertiesPanel selectedElement={mockImageElement} onPropertyChange={mockOnPropertyChange} />)
    
    const widthInput = screen.getByDisplayValue('150')
    fireEvent.change(widthInput, { target: { value: '200' } })
    
    expect(mockOnPropertyChange).toHaveBeenCalledWith('image-1', 'width', '200px')
  })

  it('handles empty property values gracefully', () => {
    const elementWithEmptyProps: DroppedElement = {
      id: 'empty-1',
      type: 'Text',
      x: 0,
      y: 0,
      properties: {},
    }
    
    render(<PropertiesPanel selectedElement={elementWithEmptyProps} onPropertyChange={mockOnPropertyChange} />)
    
    expect(screen.getByText('Text Properties')).toBeInTheDocument()
    // Should have default values or empty inputs
  })

  it('renders proper labels for all input fields', () => {
    render(<PropertiesPanel selectedElement={mockTextElement} onPropertyChange={mockOnPropertyChange} />)
    
    expect(screen.getByText('Text Content')).toBeInTheDocument()
    expect(screen.getByText('Font Size')).toBeInTheDocument()
    expect(screen.getByText('Font Weight')).toBeInTheDocument()
    expect(screen.getByText('Text Color')).toBeInTheDocument()
  })

  it('maintains proper input types', () => {
    render(<PropertiesPanel selectedElement={mockTextElement} onPropertyChange={mockOnPropertyChange} />)
    
    const colorInput = screen.getByDisplayValue('#000000')
    const fontSizeInput = screen.getByDisplayValue('16')
    
    expect(colorInput).toHaveAttribute('type', 'color')
    expect(fontSizeInput).toHaveAttribute('type', 'number')
  })
})
