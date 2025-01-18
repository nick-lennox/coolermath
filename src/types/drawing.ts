export interface DrawingOptions {
  color: string;
  lineWidth: number;
}

export const COLORS = [
  { label: 'Black', value: '#000000' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Red', value: '#dc2626' },
  { label: 'Green', value: '#16a34a' },
  { label: 'Purple', value: '#9333ea' },
  { label: 'Orange', value: '#ea580c' }
];

export const LINE_WIDTHS = [
  { label: 'Fine', value: 1 },
  { label: 'Medium', value: 4 },
  { label: 'Thick', value: 8 }
];