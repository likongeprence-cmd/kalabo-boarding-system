// src/components/signup/ClassTeacherDetails.tsx
import React, { useState } from 'react';
import { CLASSES, ALL_SUBJECTS } from '@/lib/constants';
import { Search } from 'lucide-react';

interface ClassTeacherDetailsProps {
  classTeacherOf: string;
  onClassTeacherOfChange: (value: string) => void;
  subjects: string[];
  onSubjectsChange: (subjects: string[]) => void;
  disabled?: boolean;
  step: number;
}

export function ClassTeacherDetails({
  classTeacherOf,
  onClassTeacherOfChange,
  subjects,
  onSubjectsChange,
  disabled,
  step
}: ClassTeacherDetailsProps) {
  
  const [search, setSearch] = useState('');

  const filteredSubjects = ALL_SUBJECTS.filter(s => 
    s.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSubject = (subject: string) => {
    onSubjectsChange(
      subjects.includes(subject)
        ? subjects.filter(s => s !== subject)
        : [...subjects, subject]
    );
  };

  // Step 1: Class Selection
  if (step === 1) {
    return (
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900">Select Your Class</h2>
        
        <div className="grid grid-cols-3 gap-1.5 max-h-60 overflow-y-auto p-1">
          {CLASSES.map(className => (
            <button
              key={className}
              type="button"
              onClick={() => onClassTeacherOfChange(className)}
              className={`
                p-2 rounded-lg border text-xs font-medium
                ${classTeacherOf === className
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-orange-300'
                }
              `}
            >
              {className}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Subjects
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          Subjects for {classTeacherOf}
        </h2>
        <span className="text-xs text-gray-500">{subjects.length} selected</span>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-2 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search subjects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-7 pr-2 py-1.5 text-sm border rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto p-1">
        {filteredSubjects.map(subject => (
          <label
            key={subject}
            className={`
              flex items-center gap-2 p-2 rounded-lg border text-sm cursor-pointer
              ${subjects.includes(subject)
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300'
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
    </div>
  );
}