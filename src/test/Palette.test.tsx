import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Palette from '../components/Palette'

describe('Palette Component', () => {
  it('renders all component types', () => {
    render(<Palette />)
    
    expect(screen.getByText('Text')).toBeInTheDocument()
    expect(screen.getByText('TextArea')).toBeInTheDocument()
    expect(screen.getByText('Image')).toBeInTheDocument()
    expect(screen.getByText('Button')).toBeInTheDocument()
  })

  it('renders palette title', () => {
    render(<Palette />)
    
    expect(screen.getByText('Components')).toBeInTheDocument()
    expect(screen.getByText('Drag items to the canvas')).toBeInTheDocument()
  })

  it('has draggable elements', () => {
    render(<Palette />)
    
    const textElement = screen.getByText('Text').closest('[draggable="true"]')
    const textAreaElement = screen.getByText('TextArea').closest('[draggable="true"]')
    const imageElement = screen.getByText('Image').closest('[draggable="true"]')
    const buttonElement = screen.getByText('Button').closest('[draggable="true"]')
    
    expect(textElement).toBeInTheDocument()
    expect(textAreaElement).toBeInTheDocument()
    expect(imageElement).toBeInTheDocument()
    expect(buttonElement).toBeInTheDocument()
  })

  it('handles drag start events', () => {
    render(<Palette />)
    
    const textElement = screen.getByText('Text').closest('[draggable="true"]')
    const mockDataTransfer = {
      setData: vi.fn(),
      effectAllowed: '',
    }
    
    const dragEvent = new DragEvent('dragstart', {
      bubbles: true,
      cancelable: true,
    })
    Object.defineProperty(dragEvent, 'dataTransfer', {
      value: mockDataTransfer,
    })
    
    fireEvent(textElement!, dragEvent)
    
    expect(mockDataTransfer.setData).toHaveBeenCalledWith('text/plain', 'Text')
  })

  it('provides visual feedback during drag', () => {
    render(<Palette />)
    
    const textElement = screen.getByText('Text').closest('[draggable="true"]')
    
    expect(textElement).toHaveClass('cursor-grab')
    expect(textElement).toHaveClass('hover:bg-gray-100')
  })
})
