// ==================== USER TYPES (UPDATED) ====================
export type UserType = 'planner' | 'headteacher' | 'deputy' | 'hod' | 'class_teacher' | 'subject_teacher';

export interface SubjectAssignment {
  subject: string;
  classes: string[]; // class IDs or names
}

export interface TeacherDetails {
  subjects: SubjectAssignment[];
  isClassTeacher?: boolean;
  classTeacherOf?: string; // class name if they are class teacher
  department?: string; // for HoDs
}

export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  teacherDetails?: TeacherDetails;
  isApproved: boolean; // false for teachers/HoDs until planner approves
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string; // planner ID who approved
  
  // Optional fields
  phone?: string;
  profileImage?: string;
  schoolId?: string;
  isActive: boolean;
  updatedAt?: string;
}

// ==================== LEARNER TYPE WITH GENDER ====================
export interface Learner {
  id: string;
  name: string;
  age: number;
  gender?: 'male' | 'female';
  parentPhone: string;
  studentId: string;
  classId: string;
  enrollmentDate: Date;
  status: 'active' | 'transferred' | 'graduated' | 'archived';
  
  // Optional fields for backward compatibility
  className?: string;
  graduationYear?: number;
  transferredAt?: Date;
  transferredBy?: string;
  archivedAt?: Date;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ==================== LEARNER CSV IMPORT WITH GENDER ====================
export interface CSVLearnerData {
  name: string;
  age: number;
  gender: 'male' | 'female';
  parentPhone: string;
  classId?: string;
}

// ==================== TEACHER TYPE (UPDATED) ====================
export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  subjects: SubjectAssignment[]; // Updated to use SubjectAssignment
  assignedClasses: string[];
  
  // Role-specific fields
  userType: UserType;
  isApproved: boolean;
  approvedAt?: string;
  approvedBy?: string;
  
  // Class teacher specific
  isFormTeacher?: boolean;
  assignedClassId?: string;
  assignedClassName?: string;
  
  // Employment details
  employmentDate?: Date;
  status?: 'active' | 'inactive' | 'on_leave';
  
  // Metadata
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ==================== CLASS TYPE ====================
export interface Class {
  id: string;
  name: string;
  year: number;
  type: 'grade' | 'form';
  level: number;
  section: string;
  students: number;
  teachers: string[]; // teacher IDs
  
  // Form teacher
  formTeacherId?: string;
  formTeacherName?: string;
  
  // Subject teachers
  subjectTeachers?: Array<{
    subject: string;
    teacherId: string;
    teacherName: string;
  }>;
  
  // Gender statistics
  genderStats?: {
    boys: number;
    girls: number;
    unspecified: number;
    boysPercentage: number;
    girlsPercentage: number;
  };
  
  // Status
  isActive: boolean;
  createdDate?: Date;
  nextYearClassId?: string;
  archived?: boolean;
  archivedAt?: Date;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ==================== TEACHER ASSIGNMENT INTERFACE ====================
export interface TeacherAssignment {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherEmail?: string;
  classId: string;
  className: string;
  subject: string;
  normalizedSubjectId?: string;
  isFormTeacher: boolean;
  assignedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// ==================== CSV IMPORT INTERFACES ====================
export interface CSVImportData {
  name: string;
  age: number;
  gender?: 'male' | 'female';
  parentPhone: string;
  classId?: string;
  className?: string;
}

export interface ClassCSVImportData {
  name: string;
  year: number;
  type?: 'grade' | 'form';
  level?: number;
  section?: string;
}

// ==================== DASHBOARD STATS (UPDATED) ====================
export interface DashboardStats {
  totalClasses: number;
  totalStudents: number;
  averageClassSize: number;
  totalTeachers: number;
  activeTeachers: number;
  pendingApprovals: number; // New: teachers waiting for approval
  teachersByDepartment: Record<string, number>;
  teachersByRole: Record<UserType, number>; // New: breakdown by role
  
  // Gender statistics
  genderStats?: {
    totalBoys: number;
    totalGirls: number;
    unspecified: number;
    boysPercentage: number;
    girlsPercentage: number;
  };
  
  // Academic stats
  averagePassRate?: number;
  examsGraded?: number;
  totalExams?: number;
}

// ==================== RESULTS ANALYSIS TYPES ====================
export interface GradeDistribution {
  grade: number;
  boys: number;
  girls: number;
  total: number;
  percentage: number;
  passStatus: 'distinction' | 'merit' | 'credit' | 'satisfactory' | 'fail';
}

export interface ClassPerformance {
  classId: string;
  className: string;
  candidates: {
    boys: number;
    girls: number;
    total: number;
  };
  sat: {
    boys: number;
    girls: number;
    total: number;
  };
  gradeDistribution: GradeDistribution[];
  performance: {
    quality: {
      boys: number;
      girls: number;
      total: number;
      percentage: number;
    };
    quantity: {
      boys: number;
      girls: number;
      total: number;
      percentage: number;
    };
    fail: {
      boys: number;
      girls: number;
      total: number;
      percentage: number;
    };
  };
  subjectPerformance?: Array<{
    subject: string;
    teacher: string;
    quality: number;
    quantity: number;
    fail: number;
  }>;
}

export interface SubjectPerformance {
  subject: string;
  teacher: string;
  classCount: number;
  studentCount: number;
  averageGrade: number;
  qualityRate: number;
  quantityRate: number;
  failRate: number;
}

// ==================== GENDER MIGRATION TYPES ====================
export interface GenderUpdate {
  learnerId: string;
  learnerName: string;
  className: string;
  currentGender?: 'male' | 'female';
  newGender: 'male' | 'female';
}

export interface GenderStats {
  boys: number;
  girls: number;
  unspecified: number;
  total: number;
  boysPercentage: number;
  girlsPercentage: number;
}

// ==================== APPROVAL SYSTEM TYPES (NEW) ====================
export interface ApprovalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userType: UserType;
  teacherDetails: TeacherDetails;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface ApprovalStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

// ==================== DEPARTMENT TYPES (NEW) ====================
export interface Department {
  id: string;
  name: string;
  hod?: string; // teacher ID
  hodName?: string;
  subjects: string[];
  teachers: string[]; // teacher IDs
  createdAt: string;
  updatedAt?: string;
}

export interface DepartmentStats {
  totalTeachers: number;
  totalSubjects: number;
  averagePerformance: number;
  performanceBySubject: Record<string, number>;
}