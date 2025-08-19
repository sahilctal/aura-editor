import { useState, useCallback, useRef } from 'react';

interface UseHistoryResult<T> {
  state: T;
  setState: (newState: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  pushState: (newState: T) => void;
  clearHistory: () => void;
  historyLength: number;
}

export function useHistory<T>(initialState: T, maxHistorySize: number = 50): UseHistoryResult<T> {
  // History stack - stores all states
  const [history, setHistory] = useState<T[]>([initialState]);
  // Current position in history (0 = oldest, length-1 = newest)
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  // Flag to prevent adding to history during undo/redo operations
  const isUndoRedoOperation = useRef(false);

  // Get current state
  const state = history[currentIndex];

  // Add new state to history
  const pushState = useCallback((newState: T) => {
    if (isUndoRedoOperation.current) {
      return; // Don't add to history during undo/redo
    }

    setHistory(prevHistory => {
      const newHistory = [...prevHistory];
      
      // If we're not at the latest state, remove all states after current position
      // This happens when user makes a change after undoing
      if (currentIndex < prevHistory.length - 1) {
        newHistory.splice(currentIndex + 1);
      }
      
      // Add the new state
      newHistory.push(newState);
      
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift(); // Remove oldest state
        setCurrentIndex(prev => Math.max(0, prev - 1));
      } else {
        setCurrentIndex(newHistory.length - 1);
      }
      
      return newHistory;
    });
  }, [currentIndex, maxHistorySize]);

  // Set state (wrapper that also pushes to history)
  const setState = useCallback((newState: T) => {
    pushState(newState);
  }, [pushState]);

  // Undo operation
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      isUndoRedoOperation.current = true;
      setCurrentIndex(prev => prev - 1);
      // Reset flag after state update
      setTimeout(() => {
        isUndoRedoOperation.current = false;
      }, 0);
    }
  }, [currentIndex]);

  // Redo operation
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      isUndoRedoOperation.current = true;
      setCurrentIndex(prev => prev + 1);
      // Reset flag after state update
      setTimeout(() => {
        isUndoRedoOperation.current = false;
      }, 0);
    }
  }, [currentIndex, history.length]);

  // Clear entire history and start fresh
  const clearHistory = useCallback((newInitialState?: T) => {
    const resetState = newInitialState ?? initialState;
    setHistory([resetState]);
    setCurrentIndex(0);
  }, []);

  // Check if undo is possible
  const canUndo = currentIndex > 0;

  // Check if redo is possible
  const canRedo = currentIndex < history.length - 1;

  return {
    state,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    pushState,
    clearHistory,
    historyLength: history.length
  };
}
