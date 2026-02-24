// src/components/signup/ReviewSubmit.tsx
import React from 'react';
import { UserType } from '@/hooks/useAuth';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ReviewSubmitProps {
  userType: UserType;
  formData: {
    name: string;
    email: string;
    department: string;
    subjects: string[];
    classes: string[];
    isClassTeacher: boolean;
    classTeacherOf: string;
  };
}

export function ReviewSubmit({ userType, formData }: ReviewSubmitProps) {
  const needsApproval = ['hod', 'class_teacher', 'subject_teacher'].includes(userType);

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold text-gray-900">Review & Submit</h2>

      {/* Quick Summary */}
      <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-2">
        <p><span className="text-gray-500">Name:</span> {formData.name}</p>
        <p><span className="text-gray-500">Email:</span> {formData.email}</p>
        <p><span className="text-gray-500">Role:</span> {userType.replace('_', ' ')}</p>
        
        {formData.department && (
          <p><span className="text-gray-500">Dept:</span> {formData.department}</p>
        )}
        
        {formData.subjects.length > 0 && (
          <p><span className="text-gray-500">Subjects:</span> {formData.subjects.length}</p>
        )}
        
        {formData.classes.length > 0 && (
          <p><span className="text-gray-500">Classes:</span> {formData.classes.length}</p>
        )}
        
        {formData.isClassTeacher && formData.classTeacherOf && (
          <p><span className="text-gray-500">Class Teacher:</span> {formData.classTeacherOf}</p>
        )}
      </div>

      {/* Status */}
      <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
        needsApproval ? 'bg-amber-50' : 'bg-green-50'
      }`}>
        {needsApproval ? (
          <>
            <AlertCircle size={16} className="text-amber-600" />
            <span className="text-amber-700 text-xs">Pending planner approval</span>
          </>
        ) : (
          <>
            <CheckCircle size={16} className="text-green-600" />
            <span className="text-green-700 text-xs">Account ready for creation</span>
          </>
        )}
      </div>

      {/* Terms */}
      <label className="flex items-start gap-2 text-xs">
        <input type="checkbox" className="mt-0.5" required />
        <span className="text-gray-600">
          I confirm the information is accurate
        </span>
      </label>
    </div>
  );
}