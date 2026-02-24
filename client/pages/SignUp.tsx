// src/pages/SignUp.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useAuth, UserType } from '@/hooks/useAuth';
import { RoleSelector } from '@/components/signup/RoleSelector';
import { HoDDetails } from '@/components/signup/HoDDetails';
import { SubjectTeacherDetails } from '@/components/signup/SubjectTeacherDetails';
import { ClassTeacherDetails } from '@/components/signup/ClassTeacherDetails';
import { BasicInfoForm } from '@/components/signup/BasicInfoForm';
import { ReviewSubmit } from '@/components/signup/ReviewSubmit';
import { 
  ArrowRight, 
  CheckCircle, 
  XCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Lock,
  BookOpen,
  Users,
  Layers,
  Shield
} from 'lucide-react';

// Dialog Modal Component
interface DialogProps {
  isOpen: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
}

const DialogModal = ({ isOpen, type, title, message, onClose }: DialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-2xl ${
        type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
      } border shadow-2xl`}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={type === 'success' ? 'text-green-500' : 'text-red-500'}>
              {type === 'success' ? <CheckCircle size={28} /> : <XCircle size={28} />}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-gray-600">{message}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className={`px-6 py-2.5 text-white font-medium rounded-lg ${
                type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step indicator component
const StepIndicator = ({ currentStep, totalSteps, role }: { currentStep: number; totalSteps: number; role: UserType | null }) => {
  const getStepLabel = (step: number) => {
    if (!role) return '';
    
    const labels: Record<string, string[]> = {
      'planner': ['Account Details'],
      'headteacher': ['Account Details'],
      'deputy': ['Account Details'],
      'hod': ['Role', 'Department & Subjects', 'Classes', 'Review'],
      'subject_teacher': ['Role', 'Subjects', 'Classes', 'Review'],
      'class_teacher': ['Role', 'Class Details', 'Subjects', 'Review']
    };
    
    return labels[role]?.[step - 1] || '';
  };

  if (!role || ['planner', 'headteacher', 'deputy'].includes(role)) {
    return null; // No step indicator for simple roles
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all ${
              i + 1 <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {i + 1 < currentStep ? (
                <CheckCircle size={16} />
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            {i < totalSteps - 1 && (
              <div className={`flex-1 h-1 mx-2 ${
                i + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-600">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span key={i} className="text-center flex-1">{getStepLabel(i + 1)}</span>
        ))}
      </div>
    </div>
  );
};

export default function SignUp() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    // Basic info
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    
    // Teacher specific
    department: '',
    subjects: [] as string[],
    classes: [] as string[],
    isClassTeacher: false,
    classTeacherOf: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
    redirectTo?: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const { signup, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Determine total steps based on user type
  const getTotalSteps = () => {
    if (!userType) return 1;
    if (['planner', 'headteacher', 'deputy'].includes(userType)) return 1;
    if (userType === 'hod') return 4;
    if (userType === 'subject_teacher') return 4;
    if (userType === 'class_teacher') return 4;
    return 1;
  };

  const totalSteps = getTotalSteps();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.userType === 'planner' || user.userType === 'headteacher' || user.userType === 'deputy') {
        navigate('/dashboard/admin', { replace: true });
      } else {
        navigate('/dashboard/teacher', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // Validate current step
    if (step === 1 && !userType) {
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Role Required',
        message: 'Please select your role to continue'
      });
      return;
    }

    // Validate step 2 for teacher roles
    if (step === 2) {
      if (userType === 'hod' && !formData.department) {
        setDialog({
          isOpen: true,
          type: 'error',
          title: 'Department Required',
          message: 'Please select your department'
        });
        return;
      }
      
      if (userType === 'subject_teacher' && formData.subjects.length === 0) {
        setDialog({
          isOpen: true,
          type: 'error',
          title: 'Subjects Required',
          message: 'Please select at least one subject'
        });
        return;
      }

      if (userType === 'class_teacher' && !formData.classTeacherOf) {
        setDialog({
          isOpen: true,
          type: 'error',
          title: 'Class Required',
          message: 'Please select your class'
        });
        return;
      }
    }

    // Validate step 3 for teacher roles
    if (step === 3) {
      if (userType === 'hod' && formData.subjects.length === 0) {
        setDialog({
          isOpen: true,
          type: 'error',
          title: 'Subjects Required',
          message: 'Please select at least one subject you teach'
        });
        return;
      }

      if (userType === 'subject_teacher' && formData.classes.length === 0) {
        setDialog({
          isOpen: true,
          type: 'error',
          title: 'Classes Required',
          message: 'Please select at least one class you teach'
        });
        return;
      }

      if (userType === 'class_teacher' && formData.subjects.length === 0) {
        setDialog({
          isOpen: true,
          type: 'error',
          title: 'Subjects Required',
          message: 'Please select at least one subject you teach'
        });
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const validateBasicInfo = () => {
    if (!formData.email || !formData.password || !formData.name) {
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Missing Information',
        message: 'Please fill in all required fields'
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Password Mismatch',
        message: 'The passwords you entered do not match'
      });
      return false;
    }

    if (formData.password.length < 6) {
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Weak Password',
        message: 'Password must be at least 6 characters long'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateBasicInfo()) return;

    setLoading(true);

    try {
      // Prepare teacher details based on role
      let teacherDetails = undefined;
      
      if (userType === 'hod' || userType === 'subject_teacher' || userType === 'class_teacher') {
        // Format subjects with classes
        const subjectAssignments = formData.subjects.map(subject => ({
          subject,
          classes: formData.classes
        }));

        teacherDetails = {
          subjects: subjectAssignments,
          isClassTeacher: formData.isClassTeacher,
          classTeacherOf: formData.classTeacherOf || undefined,
          ...(userType === 'hod' && { department: formData.department })
        };
      }

      await signup(
        formData.email,
        formData.password,
        formData.name,
        userType!,
        teacherDetails
      );

      // Show success message based on role
      const needsApproval = ['subject_teacher', 'class_teacher', 'hod'].includes(userType!);
      const message = needsApproval
        ? `Your ${userType?.replace('_', ' ')} account has been created and is pending approval. You will be notified once approved.`
        : `Your ${userType} account has been created successfully. You can now sign in.`;

      setDialog({
        isOpen: true,
        type: 'success',
        title: 'Account Created!',
        message,
        redirectTo: '/signin'
      });

    } catch (err: any) {
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Sign Up Failed',
        message: err.message || 'Unable to create account. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialog(prev => ({ ...prev, isOpen: false }));
    if (dialog.type === 'success' && dialog.redirectTo) {
      navigate(dialog.redirectTo, {
        state: {
          message: dialog.message,
          email: formData.email
        }
      });
    }
  };

  // Render current step
  const renderStep = () => {
    // Simple roles (planner, headteacher, deputy) - just show basic info
    if (userType && ['planner', 'headteacher', 'deputy'].includes(userType)) {
      return (
        <div className="space-y-6">
          <BasicInfoForm
            formData={formData}
            onChange={handleChange}
            loading={loading}
          />
          
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      );
    }

    // Progressive steps for teacher roles
    switch (step) {
      case 1: // Role Selection
        return (
          <div className="space-y-6">
            <RoleSelector
              selectedRole={userType}
              onSelectRole={setUserType}
              disabled={loading}
            />
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleNext}
                disabled={!userType || loading}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all flex items-center gap-2"
              >
                Continue
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        );

      case 2: // Role-specific step 1
        return (
          <div className="space-y-6">
            {userType === 'hod' && (
              <HoDDetails
                department={formData.department}
                onDepartmentChange={(dept) => setFormData(prev => ({ ...prev, department: dept }))}
                subjects={formData.subjects}
                onSubjectsChange={(subjects) => setFormData(prev => ({ ...prev, subjects }))}
                classes={formData.classes}
                onClassesChange={(classes) => setFormData(prev => ({ ...prev, classes }))}
                isClassTeacher={formData.isClassTeacher}
                onIsClassTeacherChange={(value) => setFormData(prev => ({ ...prev, isClassTeacher: value }))}
                classTeacherOf={formData.classTeacherOf}
                onClassTeacherOfChange={(value) => setFormData(prev => ({ ...prev, classTeacherOf: value }))}
                disabled={loading}
                step={1} // First step of HoD form
              />
            )}

            {userType === 'subject_teacher' && (
              <SubjectTeacherDetails
                subjects={formData.subjects}
                onSubjectsChange={(subjects) => setFormData(prev => ({ ...prev, subjects }))}
                classes={formData.classes}
                onClassesChange={(classes) => setFormData(prev => ({ ...prev, classes }))}
                isClassTeacher={formData.isClassTeacher}
                onIsClassTeacherChange={(value) => setFormData(prev => ({ ...prev, isClassTeacher: value }))}
                classTeacherOf={formData.classTeacherOf}
                onClassTeacherOfChange={(value) => setFormData(prev => ({ ...prev, classTeacherOf: value }))}
                disabled={loading}
                step={1} // First step: Subjects
              />
            )}

            {userType === 'class_teacher' && (
              <ClassTeacherDetails
                classTeacherOf={formData.classTeacherOf}
                onClassTeacherOfChange={(value) => setFormData(prev => ({ ...prev, classTeacherOf: value }))}
                subjects={formData.subjects}
                onSubjectsChange={(subjects) => setFormData(prev => ({ ...prev, subjects }))}
                disabled={loading}
                step={1} // First step: Class selection
              />
            )}

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                <ChevronLeft size={18} />
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all flex items-center gap-2"
              >
                Continue
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        );

      case 3: // Role-specific step 2
        return (
          <div className="space-y-6">
            {userType === 'hod' && (
              <HoDDetails
                department={formData.department}
                onDepartmentChange={(dept) => setFormData(prev => ({ ...prev, department: dept }))}
                subjects={formData.subjects}
                onSubjectsChange={(subjects) => setFormData(prev => ({ ...prev, subjects }))}
                classes={formData.classes}
                onClassesChange={(classes) => setFormData(prev => ({ ...prev, classes }))}
                isClassTeacher={formData.isClassTeacher}
                onIsClassTeacherChange={(value) => setFormData(prev => ({ ...prev, isClassTeacher: value }))}
                classTeacherOf={formData.classTeacherOf}
                onClassTeacherOfChange={(value) => setFormData(prev => ({ ...prev, classTeacherOf: value }))}
                disabled={loading}
                step={2} // Second step: Subjects
              />
            )}

            {userType === 'subject_teacher' && (
              <SubjectTeacherDetails
                subjects={formData.subjects}
                onSubjectsChange={(subjects) => setFormData(prev => ({ ...prev, subjects }))}
                classes={formData.classes}
                onClassesChange={(classes) => setFormData(prev => ({ ...prev, classes }))}
                isClassTeacher={formData.isClassTeacher}
                onIsClassTeacherChange={(value) => setFormData(prev => ({ ...prev, isClassTeacher: value }))}
                classTeacherOf={formData.classTeacherOf}
                onClassTeacherOfChange={(value) => setFormData(prev => ({ ...prev, classTeacherOf: value }))}
                disabled={loading}
                step={2} // Second step: Classes
              />
            )}

            {userType === 'class_teacher' && (
              <ClassTeacherDetails
                classTeacherOf={formData.classTeacherOf}
                onClassTeacherOfChange={(value) => setFormData(prev => ({ ...prev, classTeacherOf: value }))}
                subjects={formData.subjects}
                onSubjectsChange={(subjects) => setFormData(prev => ({ ...prev, subjects }))}
                disabled={loading}
                step={2} // Second step: Subjects
              />
            )}

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                <ChevronLeft size={18} />
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all flex items-center gap-2"
              >
                Continue
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        );

      case 4: // Basic Info & Review
        return (
          <div className="space-y-6">
            <BasicInfoForm
              formData={formData}
              onChange={handleChange}
              loading={loading}
            />

            {/* Review Section */}
            <ReviewSubmit
              userType={userType!}
              formData={formData}
            />

            {/* Approval Notice */}
            {userType && ['subject_teacher', 'class_teacher', 'hod'].includes(userType) && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-700">
                  <span className="font-medium">Note:</span> Your account will require approval from the planner before you can access the system.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                <ChevronLeft size={18} />
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <DialogModal
        isOpen={dialog.isOpen}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onClose={handleDialogClose}
      />

      <Layout className="flex items-center justify-center min-h-screen py-8 px-4">
        <div className="w-full max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">
              Join KalaboBoarding School Management System
            </p>
          </div>

          {/* Progress Steps - Only for teacher roles */}
          <StepIndicator 
            currentStep={step} 
            totalSteps={totalSteps} 
            role={userType} 
          />

          {/* Main Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
            {renderStep()}

            {/* Sign In Link */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{' '}
                  <Link
                    to="/signin"
                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center gap-1"
                  >
                    Sign In
                    <ArrowRight size={14} />
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}