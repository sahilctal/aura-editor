export interface ElementProperties {
  // Text properties
  text?: string;
  fontSize?: string | number;
  fontWeight?: string;
  color?: string;
  textContent?: string;
  
  // Image properties
  src?: string;
  imageUrl?: string;
  alt?: string;
  objectFit?: string;
  borderRadius?: string | number;
  
  // Common properties
  width?: string | number;
  height?: string | number;
  backgroundColor?: string;
  padding?: string;
  
  // TextArea properties
  placeholder?: string;
  textAreaContent?: string;
  
  // Button properties
  buttonText?: string;
  buttonColor?: string;
}

export interface DroppedElement {
  id: string;
  type: string;
  x: number;
  y: number;
  properties?: ElementProperties;
}

export interface DragState {
  isDragging: boolean;
  elementId: string | null;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
}

