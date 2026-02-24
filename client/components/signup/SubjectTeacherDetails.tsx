// src/components/signup/SubjectTeacherDetails.tsx
import React from 'react';
import { ALL_SUBJECTS, CLASSES, SUBJECTS_BY_DEPARTMENT } from '@/lib/constants';
import { BookOpen, Users, CheckCircle, Search } from 'lucide-react';

interface SubjectTeacherDetailsProps {
  // Subjects
  subjects: string[];
  onSubjectsChange: (subjects: string[]) => void;
  
  // Classes
  classes: string[];
  onClassesChange: (classes: string[]) => void;
  
  // Class Teacher Option
  isClassTeacher: boolean;
  onIsClassTeacherChange: (value: boolean) => void;
  classTeacherOf: string;
  onClassTeacherOfChange: (value: string) => void;
  
  // UI State
  disabled?: boolean;
  step: number; // 1: Subjects, 2: Classes & Class Teacher
}

export function SubjectTeacherDetails({
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
}: SubjectTeacherDetailsProps) {
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedDepartment, setSelectedDepartment] = React.useState<string>('all');

  // Get unique departments for filtering
  const departments = ['all', ...Object.keys(SUBJECTS_BY_DEPARTMENT)];

  // Filter subjects based on search and department
  const filteredSubjects = ALL_SUBJECTS.filter(subject => {
    const matchesSearch = subject.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedDepartment === 'all') return matchesSearch;
    
    const subjectDepartment = Object.entries(SUBJECTS_BY_DEPARTMENT).find(
      ([_, deptSubjects]) => deptSubjects.includes(subject)
    )?.[0];
    
    return matchesSearch && subjectDepartment === selectedDepartment;
  });

  const toggleSubject = (subject: string) => {
    if (subjects.includes(subject)) {
      onSubjectsChange(subjects.filter(s => s !== subject));
    } else {
      onSubjectsChange([...subjects, subject]);
    }
  };

  const toggleClass = (className: string) => {
    if (classes.includes(className)) {
      onClassesChange(classes.filter(c => c !== className));
    } else {
      onClassesChange([...classes, className]);
    }
  };

  const selectAllSubjects = () => {
    onSubjectsChange(filteredSubjects);
  };

  const clearAllSubjects = () => {
    onSubjectsChange([]);
  };

  const selectAllClasses = () => {
    onClassesChange([...CLASSES]);
  };

  const clearAllClasses = () => {
    onClassesChange([]);
  };

  // Step 1: Subjects Selection
  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Step 1: Select Your Subjects</h2>
          <p className="text-sm text-gray-500 mt-1">
            Choose all the subjects you teach
          </p>
        </div>

        <div className="space-y-4">
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Selection Controls */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {subjects.length} subjects selected
            </span>
            <div className="space-x-2">
              <button
                type="button"
                onClick={selectAllSubjects}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={clearAllSubjects}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
            {filteredSubjects.map(subject => (
              <label
                key={subject}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                  ${subjects.includes(subject)
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 bg-white hover:border-teal-300'
                  }
                `}
              >
                <input
                  type="checkbox"
                  checked={subjects.includes(subject)}
                  onChange={() => toggleSubject(subject)}
                  disabled={disabled}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-gray-700">{subject}</span>
              </label>
            ))}
          </div>

          {filteredSubjects.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No subjects found matching your search
            </div>
          )}

          {subjects.length === 0 && (
            <p className="text-sm text-amber-600">
              Please select at least one subject to continue
            </p>
          )}
        </div>
      </div>
    );
  }

  // Step 2: Classes and Class Teacher Option
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Step 2: Assign Classes</h2>
        <p className="text-sm text-gray-500 mt-1">
          Select the classes where you teach your subjects
        </p>
      </div>

      {subjects.length === 0 ? (
        <div className="p-8 text-center bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-yellow-700">
            Please select your subjects first before assigning classes.
          </p>
        </div>
      ) : (
        <>
          {/* Classes Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Classes You Teach *
              </label>
              <span className="text-sm text-gray-500">
                {classes.length} selected
              </span>
            </div>

            {/* Class Selection Controls */}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={selectAllClasses}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={clearAllClasses}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                Clear
              </button>
            </div>

            {/* Classes by Level */}
            <div className="space-y-4">
              {/* Junior Secondary (Forms) */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Junior Secondary (Forms 1-2)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg">
                  {CLASSES.filter(c => c.startsWith('Form')).map(className => (
                    <label
                      key={className}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                        ${classes.includes(className)
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 bg-white hover:border-teal-300'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={classes.includes(className)}
                        onChange={() => toggleClass(className)}
                        disabled={disabled}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{className}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Senior Secondary (Grades) */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Senior Secondary (Grades 10-12)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg">
                  {CLASSES.filter(c => c.startsWith('Grade')).map(className => (
                    <label
                      key={className}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                        ${classes.includes(className)
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 bg-white hover:border-teal-300'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={classes.includes(className)}
                        onChange={() => toggleClass(className)}
                        disabled={disabled}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{className}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Class Teacher Option */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={isClassTeacher}
                onChange={(e) => onIsClassTeacherChange(e.target.checked)}
                disabled={disabled}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  I am also a Class Teacher
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Check this if you are responsible for a specific class
                </p>
              </div>
            </label>

            {isClassTeacher && (
              <div className="space-y-3 pl-8">
                <label className="block text-sm font-medium text-gray-700">
                  Select Your Class *
                </label>
                <select
                  value={classTeacherOf}
                  onChange={(e) => onClassTeacherOfChange(e.target.value)}
                  disabled={disabled}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Choose a class</option>
                  {CLASSES.map(className => (
                    <option key={className} value={className}>{className}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
            <h4 className="font-medium text-teal-800 mb-2">Summary:</h4>
            <ul className="space-y-1 text-sm text-teal-700">
              <li>• Subjects: {subjects.length} selected</li>
              <li>• Classes: {classes.length} selected</li>
              {isClassTeacher && <li>• Class Teacher of: {classTeacherOf}</li>}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}