import '@testing-library/jest-dom'

// Mock DragEvent
global.DragEvent = class extends Event {
  dataTransfer: DataTransfer | null = null
  constructor(type: string, eventInitDict?: DragEventInit) {
    super(type, eventInitDict)
    this.dataTransfer = eventInitDict?.dataTransfer || {
      setData: vi.fn(),
      getData: vi.fn(),
      effectAllowed: 'all',
      dropEffect: 'none',
    } as any
  }
} as any

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock clipboard API
if (!navigator.clipboard) {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
    writable: true,
  })
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
