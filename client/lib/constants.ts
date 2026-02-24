// src/lib/constants.ts

// ========== DEPARTMENTS ==========
export const DEPARTMENTS = [
  'Natural Sciences',
  'Industrial Arts',
  'Mathematics',
  'Creative Arts',
  'Business',
  'Languages',
  'Social Sciences'
] as const;

// ========== SUBJECTS BY DEPARTMENT ==========
export const SUBJECTS_BY_DEPARTMENT: Record<string, string[]> = {
  'Natural Sciences': [
    'Physics',
    'Chemistry', 
    'Biology',
    'Science'
  ],
  
  'Industrial Arts': [
    'Design and Technology',
    'Computer Science',
    'Computer Studies',
    'Home Economics',
    'Home Management',
    'Food and Nutrition',
    'Fashion and Fabrics'
  ],
  
  'Mathematics': [
    'Mathematics',
    'Additional Mathematics'
  ],
  
  'Creative Arts': [
    'Art',
    'Music Education'
  ],
  
  'Business': [
    'Business Studies',
    'Commerce',
    'Principles of Accounts'
  ],
  
  'Languages': [
    'English Language',
    'Literature',
    'Silozi'
  ],
  
  'Social Sciences': [
    'Social Studies',
    'Civic Education',
    'Geography',
    'Religious Education',
    'History'
  ]
};

// ========== ALL SUBJECTS FLATTENED (for easy access) ==========
export const ALL_SUBJECTS = Object.values(SUBJECTS_BY_DEPARTMENT).flat();

// ========== CLASSES ==========
export const CLASSES = [
  // Form 1 (Junior Secondary)
  'Form 1A', 'Form 1B', 'Form 1C', 'Form 1D', 'Form 1E',
  
  // Form 2 (Junior Secondary)
  'Form 2A', 'Form 2B', 'Form 2C', 'Form 2D', 'Form 2E',
  
  // Grade 10 (Senior Secondary)
  'Grade 10A', 'Grade 10B', 'Grade 10C', 'Grade 10D', 'Grade 10E', 'Grade 10F',
  
  // Grade 11 (Senior Secondary)
  'Grade 11A', 'Grade 11B', 'Grade 11C', 'Grade 11D', 'Grade 11E', 'Grade 11F',
  
  // Grade 12 (Senior Secondary)
  'Grade 12A', 'Grade 12B', 'Grade 12C', 'Grade 12D', 'Grade 12E', 'Grade 12F'
] as const;

// ========== CLASS GROUPINGS ==========

// Junior Secondary Classes (Forms 1-2)
export const JUNIOR_CLASSES = CLASSES.filter(c => c.startsWith('Form'));

// Senior Secondary Classes (Grades 10-12)
export const SENIOR_CLASSES = CLASSES.filter(c => c.startsWith('Grade'));

// Group classes by level for easier organization
export const CLASSES_BY_LEVEL = {
  'Form 1': ['Form 1A', 'Form 1B', 'Form 1C', 'Form 1D', 'Form 1E'],
  'Form 2': ['Form 2A', 'Form 2B', 'Form 2C', 'Form 2D', 'Form 2E'],
  'Grade 10': ['Grade 10A', 'Grade 10B', 'Grade 10C', 'Grade 10D', 'Grade 10E', 'Grade 10F'],
  'Grade 11': ['Grade 11A', 'Grade 11B', 'Grade 11C', 'Grade 11D', 'Grade 11E', 'Grade 11F'],
  'Grade 12': ['Grade 12A', 'Grade 12B', 'Grade 12C', 'Grade 12D', 'Grade 12E', 'Grade 12F']
};

// ========== HELPER FUNCTIONS ==========

/**
 * Get subjects for a specific department
 */
export function getSubjectsByDepartment(department: string): string[] {
  return SUBJECTS_BY_DEPARTMENT[department] || [];
}

/**
 * Get department for a specific subject
 */
export function getDepartmentForSubject(subject: string): string | undefined {
  for (const [dept, subjects] of Object.entries(SUBJECTS_BY_DEPARTMENT)) {
    if (subjects.includes(subject)) {
      return dept;
    }
  }
  return undefined;
}

/**
 * Group subjects by department (useful for displaying in UI)
 */
export const SUBJECTS_GROUPED = Object.entries(SUBJECTS_BY_DEPARTMENT).map(([department, subjects]) => ({
  department,
  subjects
}));

/**
 * Get all classes for a specific level (e.g., "Form 1", "Grade 10")
 */
export function getClassesByLevel(level: string): string[] {
  return CLASSES_BY_LEVEL[level as keyof typeof CLASSES_BY_LEVEL] || [];
}

/**
 * Get level from class name (e.g., "Form 1A" -> "Form 1")
 */
export function getLevelFromClass(className: string): string {
  if (className.startsWith('Form')) {
    return className.split(' ').slice(0, 2).join(' '); // "Form 1A" -> "Form 1"
  } else if (className.startsWith('Grade')) {
    return className.split(' ').slice(0, 2).join(' '); // "Grade 10A" -> "Grade 10"
  }
  return '';
}

/**
 * Check if class is Junior Secondary (Form)
 */
export function isJuniorClass(className: string): boolean {
  return className.startsWith('Form');
}

/**
 * Check if class is Senior Secondary (Grade)
 */
export function isSeniorClass(className: string): boolean {
  return className.startsWith('Grade');
}

// ========== TYPE EXPORTS ==========
export type Department = typeof DEPARTMENTS[number];
export type Subject = typeof ALL_SUBJECTS[number];
export type Class = typeof CLASSES[number];
export type ClassLevel = keyof typeof CLASSES_BY_LEVEL;