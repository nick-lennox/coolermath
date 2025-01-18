import { Subject } from '../types/subjects';

export const subjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    icon: 'Calculator',
    hasLevel: true
  }
];

export const mathLevels = {
  'SAT': ['algebra', 'geometry', 'trigonometry'],
  'ACT': ['algebra', 'geometry', 'trigonometry'],
  'AP_CALC_AB': ['precalculus', 'calculus'],
  'AP_CALC_BC': ['precalculus', 'calculus']
} as const;

export const testTypes = [
  { id: 'SAT', name: 'SAT Math' },
  { id: 'ACT', name: 'ACT Math' },
  { id: 'AP_CALC_AB', name: 'AP Calculus AB' },
  { id: 'AP_CALC_BC', name: 'AP Calculus BC' }
] as const;

export const topics = {
  'algebra': [
    'Linear Equations',
    'Quadratic Equations',
    'Functions',
    'Systems of Equations'
  ],
  'geometry': [
    'Triangles',
    'Circles',
    'Polygons',
    'Coordinate Geometry'
  ],
  'trigonometry': [
    'Right Triangles',
    'Unit Circle',
    'Trigonometric Functions',
    'Identities'
  ],
  'precalculus': [
    'Complex Numbers',
    'Vectors',
    'Sequences and Series',
    'Limits'
  ],
  'calculus': [
    'Derivatives',
    'Integrals',
    'Applications',
    'Series and Sequences'
  ]
} as const;