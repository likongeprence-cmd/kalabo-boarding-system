// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserType } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserType[];
  requireApproval?: boolean; // Whether to check approval status
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = ['planner', 'subject_teacher', 'class_teacher', 'hod', 'headteacher', 'deputy'],
  requireApproval = true 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, userType } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // Check if user exists (should, since authenticated)
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Check approval status for teacher roles that require approval
  const requiresApproval = ['subject_teacher', 'class_teacher', 'hod'].includes(user.userType);
  
  if (requireApproval && requiresApproval && !user.isApproved) {
    console.log('⏳ User pending approval, redirecting to pending page');
    return <Navigate to="/pending-approval" replace />;
  }

  // Check if user role is allowed for this route
  if (!allowedRoles.includes(userType)) {
    console.log('🚫 User role not authorized for this route');
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

// ========== HELPER COMPONENTS FOR COMMON ROUTE TYPES ==========

/**
 * Protected route for admin/management roles (planner, headteacher, deputy)
 */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['planner', 'headteacher', 'deputy']}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Protected route for all teacher roles (including HoD)
 */
export function TeacherRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['subject_teacher', 'class_teacher', 'hod']}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Protected route specifically for HoD
 */
export function HoDRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['hod']}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Protected route for class teachers
 */
export function ClassTeacherRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['class_teacher']}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Protected route for subject teachers
 */
export function SubjectTeacherRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['subject_teacher']}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Route for users to check their approval status
 * Useful for pending users to see their status
 */
export function ApprovalAwareRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // If user is pending approval, redirect to pending page
  if (user && !user.isApproved && ['subject_teacher', 'class_teacher', 'hod'].includes(user.userType)) {
    return <Navigate to="/pending-approval" replace />;
  }

  return <>{children}</>;
}