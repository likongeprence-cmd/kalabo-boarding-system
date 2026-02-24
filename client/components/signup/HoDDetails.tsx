// src/components/signup/HoDDetails.tsx
import React from 'react';
import { DEPARTMENTS, SUBJECTS_BY_DEPARTMENT, CLASSES } from '@/lib/constants';
import { ChevronRight } from 'lucide-react';

interface HoDDetailsProps {
  department: string;
  onDepartmentChange: (dept: string) => void;
  subjects: string[];
  onSubjectsChange: (subjects: string[]) => void;
  classes: string[];
  onClassesChange: (classes: string[]) => void;
  isClassTeacher: boolean;
  onIsClassTeacherChange: (value: boolean) => void;
  classTeacherOf: string;
  onClassTeacherOfChange: (value: string) => void;
  disabled?: boolean;
  step: number;
}

export function HoDDetails({
  department,
  onDepartmentChange,
  subjects,
  onSubjectsChange,
  classes,
  onClassesChange,
  isClassTeacher,
  onIsClassTeacherChange,
  classTeacherOf,
  onClassTeacherOfChange,
  disabled,
  step
}: HoDDetailsProps) {
  
  const availableSubjects = department ? SUBJECTS_BY_DEPARTMENT[department] || [] : [];

  const toggleSubject = (subject: string) => {
    onSubjectsChange(
      subjects.includes(subject) 
        ? subjects.filter(s => s !== subject)
        : [...subjects, subject]
    );
  };

  const toggleClass = (className: string) => {
    onClassesChange(
      classes.includes(className)
        ? classes.filter(c => c !== className)
        : [...classes, className]
    );
  };

  // Step 1: Department Selection
  if (step === 1) {
    return (
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900">Select Department</h2>
        <div className="space-y-1.5">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => onDepartmentChange(dept)}
              className={`
                w-full p-2.5 rounded-lg border text-left text-sm flex items-center justify-between
                ${department === dept 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-green-300'
                }
              `}
            >
              <span className="font-medium">{dept}</span>
              {department === dept && (
                <span className="text-xs text-green-600">✓ Selected</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Subjects Selection
  if (step === 2) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Select Subjects</h2>
          <span className="text-xs text-gray-500">{subjects.length} selected</span>
        </div>
        
        {!department ? (
          <p className="text-xs text-yellow-600 p-3 bg-yellow-50 rounded">
            Select department first
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto p-1">
            {availableSubjects.map(subject => (
              <label
                key={subject}
                className={`
                  flex items-center gap-2 p-2 rounded-lg border text-sm cursor-pointer
                  ${subjects.includes(subject)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                  }
                `}
              >
                <input
                  type="checkbox"
                  checked={subjects.includes(subject)}
                  onChange={() => toggleSubject(subject)}
                  className="w-3.5 h-3.5"
                />
                <span className="truncate">{subject}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Step 3: Classes
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Assign Classes</h2>
        <span className="text-xs text-gray-500">{classes.length} selected</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto p-1">
        {CLASSES.map(className => (
          <label
            key={className}
            className={`
              flex items-center gap-2 p-2 rounded-lg border text-sm cursor-pointer
              ${classes.includes(className)
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
              }
            `}
          >
            <input
              type="checkbox"
              checked={classes.includes(className)}
              onChange={() => toggleClass(className)}
              className="w-3.5 h-3.5"
            />
            <span className="truncate">{className}</span>
          </label>
        ))}
      </div>

      {/* Class Teacher Option */}
      <div className="pt-2 border-t">
        <label className="flex items-center gap-2 p-2">
          <input
            type="checkbox"
            checked={isClassTeacher}
            onChange={(e) => onIsClassTeacherChange(e.target.checked)}
            className="w-3.5 h-3.5"
          />
          <span className="text-sm">I'm a Class Teacher</span>
        </label>

        {isClassTeacher && (
          <select
            value={classTeacherOf}
            onChange={(e) => onClassTeacherOfChange(e.target.value)}
            className="w-full mt-2 p-2 text-sm border rounded"
          >
            <option value="">Select class</option>
            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>
    </div>
  );
}