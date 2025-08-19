import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PreviewModal from '../components/PreviewModal'

const mockProps = {
  isOpen: true,
  onClose: vi.fn(),
  htmlContent: '<div>Desktop HTML Content</div>',
  mobileHtmlContent: '<div style="max-width: 375px;">Mobile HTML Content</div>',
}

describe('PreviewModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not render when isOpen is false', () => {
    render(<PreviewModal {...mockProps} isOpen={false} />)
    
    expect(screen.queryByText('Canvas Preview')).not.toBeInTheDocument()
  })

  it('renders modal when isOpen is true', () => {
    render(<PreviewModal {...mockProps} />)
    
    expect(screen.getByText('Canvas Preview')).toBeInTheDocument()
    expect(screen.getByText('👁️ Visual')).toBeInTheDocument()
    expect(screen.getByText('📄 HTML Code')).toBeInTheDocument()
  })

  it('renders view mode toggle buttons', () => {
    render(<PreviewModal {...mockProps} />)
    
    const visualButton = screen.getByText('👁️ Visual')
    const codeButton = screen.getByText('📄 HTML Code')
    
    expect(visualButton).toBeInTheDocument()
    expect(codeButton).toBeInTheDocument()
  })

  it('renders device mode toggle buttons', () => {
    render(<PreviewModal {...mockProps} />)
    
    expect(screen.getByText('🖥️ Desktop')).toBeInTheDocument()
    expect(screen.getByText('📱 Mobile (375px)')).toBeInTheDocument()
  })

  it('switches between visual and code view modes', () => {
    render(<PreviewModal {...mockProps} />)
    
    // Initially in visual mode
    expect(screen.getByText('Mode: Visual Preview')).toBeInTheDocument()
    
    // Switch to code mode
    fireEvent.click(screen.getByText('📄 HTML Code'))
    expect(screen.getByText('Mode: HTML Code')).toBeInTheDocument()
    
    // Copy button should appear in code mode
    expect(screen.getByText('📋 Copy Desktop HTML')).toBeInTheDocument()
  })

  it('switches between desktop and mobile preview modes', () => {
    render(<PreviewModal {...mockProps} />)
    
    // Initially in desktop mode
    expect(screen.getByText('Desktop layout')).toBeInTheDocument()
    
    // Switch to mobile mode
    fireEvent.click(screen.getByText('📱 Mobile (375px)'))
    expect(screen.getByText('Mobile layout (375px)')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    render(<PreviewModal {...mockProps} />)
    
    fireEvent.click(screen.getByText('×'))
    expect(mockProps.onClose).toHaveBeenCalledTimes(1)
    
    fireEvent.click(screen.getByText('Close'))
    expect(mockProps.onClose).toHaveBeenCalledTimes(2)
  })

  it('copies HTML content to clipboard', async () => {
    render(<PreviewModal {...mockProps} />)
    
    // Switch to code mode to see copy button
    fireEvent.click(screen.getByText('📄 HTML Code'))
    
    const copyButton = screen.getByText('📋 Copy Desktop HTML')
    fireEvent.click(copyButton)
    
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockProps.htmlContent)
    })
    
    // Check success feedback
    expect(screen.getByText('✓ Copied!')).toBeInTheDocument()
  })

  it('shows different content for mobile and desktop modes', () => {
    render(<PreviewModal {...mockProps} />)
    
    // Switch to code mode to see content
    fireEvent.click(screen.getByText('📄 HTML Code'))
    
    // Desktop content
    expect(screen.getByText(mockProps.htmlContent)).toBeInTheDocument()
    
    // Switch to mobile mode
    fireEvent.click(screen.getByText('📱 Mobile (375px)'))
    
    // Mobile content
    expect(screen.getByText(mockProps.mobileHtmlContent)).toBeInTheDocument()
  })

  it('displays correct file size and line count in code mode', () => {
    render(<PreviewModal {...mockProps} />)
    
    // Switch to code mode
    fireEvent.click(screen.getByText('📄 HTML Code'))
    
    const expectedSize = new Blob([mockProps.htmlContent]).size
    const expectedLines = mockProps.htmlContent.split('\n').length
    
    expect(screen.getByText(`Size: ${expectedSize} bytes`)).toBeInTheDocument()
    expect(screen.getByText(`Lines: ${expectedLines}`)).toBeInTheDocument()
  })

  it('handles clipboard copy failure gracefully', async () => {
    // Mock clipboard to throw an error
    const originalClipboard = navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockRejectedValue(new Error('Clipboard error')),
      },
    })
    
    render(<PreviewModal {...mockProps} />)
    
    fireEvent.click(screen.getByText('📄 HTML Code'))
    fireEvent.click(screen.getByText('📋 Copy Desktop HTML'))
    
    // Should fall back to document.execCommand
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled()
    })
    
    // Restore original clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
    })
  })

  it('applies correct styling and dimensions', () => {
    render(<PreviewModal {...mockProps} />)
    
    const modalOverlay = screen.getByRole('dialog') || document.querySelector('[style*="position: fixed"]')
    expect(modalOverlay).toBeInTheDocument()
  })
})
