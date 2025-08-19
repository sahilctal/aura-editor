import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useHistory } from '../hooks/useHistory'

interface TestState {
  value: number
  name: string
}

describe('useHistory Hook', () => {
  it('initializes with empty history', () => {
    const { result } = renderHook(() => useHistory<TestState>())
    
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(false)
  })

  it('pushes new states to history', () => {
    const { result } = renderHook(() => useHistory<TestState>())
    
    act(() => {
      result.current.pushState({ value: 1, name: 'first' })
    })
    
    expect(result.current.canUndo).toBe(true)
    expect(result.current.canRedo).toBe(false)
  })

  it('performs undo operation', () => {
    const { result } = renderHook(() => useHistory<TestState>())
    
    act(() => {
      result.current.pushState({ value: 1, name: 'first' })
      result.current.pushState({ value: 2, name: 'second' })
    })
    
    let undoResult: TestState | null = null
    act(() => {
      undoResult = result.current.undo()
    })
    
    expect(undoResult).toEqual({ value: 1, name: 'first' })
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(true)
  })

  it('performs redo operation', () => {
    const { result } = renderHook(() => useHistory<TestState>())
    
    act(() => {
      result.current.pushState({ value: 1, name: 'first' })
      result.current.pushState({ value: 2, name: 'second' })
      result.current.undo()
    })
    
    let redoResult: TestState | null = null
    act(() => {
      redoResult = result.current.redo()
    })
    
    expect(redoResult).toEqual({ value: 2, name: 'second' })
    expect(result.current.canUndo).toBe(true)
    expect(result.current.canRedo).toBe(false)
  })

  it('maintains history limit of 50 states', () => {
    const { result } = renderHook(() => useHistory<TestState>())
    
    act(() => {
      // Push 60 states to test the limit
      for (let i = 1; i <= 60; i++) {
        result.current.pushState({ value: i, name: `state-${i}` })
      }
    })
    
    // Should only be able to undo 49 times (50 states total)
    let undoCount = 0
    act(() => {
      while (result.current.canUndo) {
        result.current.undo()
        undoCount++
      }
    })
    
    expect(undoCount).toBe(49) // 50 states means 49 undo operations
  })

  it('clears history', () => {
    const { result } = renderHook(() => useHistory<TestState>())
    
    act(() => {
      result.current.pushState({ value: 1, name: 'first' })
      result.current.pushState({ value: 2, name: 'second' })
    })
    
    expect(result.current.canUndo).toBe(true)
    
    act(() => {
      result.current.clearHistory()
    })
    
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(false)
  })

  it('truncates future states when pushing new state after undo', () => {
    const { result } = renderHook(() => useHistory<TestState>())
    
    act(() => {
      result.current.pushState({ value: 1, name: 'first' })
      result.current.pushState({ value: 2, name: 'second' })
      result.current.pushState({ value: 3, name: 'third' })
      result.current.undo() // Go back to 'second'
      result.current.undo() // Go back to 'first'
    })
    
    expect(result.current.canRedo).toBe(true)
    
    act(() => {
      result.current.pushState({ value: 4, name: 'branch' })
    })
    
    // Should no longer be able to redo to 'second' or 'third'
    expect(result.current.canRedo).toBe(false)
    
    let redoResult: TestState | null = null
    act(() => {
      redoResult = result.current.redo()
    })
    
    expect(redoResult).toBe(null)
  })

  it('returns null when trying to undo/redo at boundaries', () => {
    const { result } = renderHook(() => useHistory<TestState>())
    
    // Try undo with empty history
    let undoResult: TestState | null = null
    act(() => {
      undoResult = result.current.undo()
    })
    expect(undoResult).toBe(null)
    
    // Try redo with no future states
    let redoResult: TestState | null = null
    act(() => {
      redoResult = result.current.redo()
    })
    expect(redoResult).toBe(null)
  })
})
