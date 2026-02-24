// src/pages/hod/DepartmentTeachers.tsx
import { Layout } from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Search, UserPlus, Mail, BookOpen, Users } from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  classes: string[];
  isClassTeacher: boolean;
  classTeacherOf?: string;
}

export default function DepartmentTeachers() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual data from Firestore
  const teachers: Teacher[] = [
    {
      id: '1',
      name: 'John Mwale',
      email: 'john.mwale@school.com',
      subjects: ['Mathematics', 'Additional Mathematics'],
      classes: ['Grade 10A', 'Grade 10B', 'Grade 11A'],
      isClassTeacher: true,
      classTeacherOf: 'Grade 10A'
    },
    {
      id: '2',
      name: 'Mary Banda',
      email: 'mary.banda@school.com',
      subjects: ['Physics', 'Chemistry'],
      classes: ['Grade 11A', 'Grade 11B', 'Grade 12A'],
      isClassTeacher: false
    }
  ];

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Department Teachers</h1>
            <p className="text-gray-600 mt-1">
              {user?.teacherDetails?.department || 'Department'} Staff
            </p>
          </div>
          <button className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <UserPlus size={18} />
            Add Teacher
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Teachers List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {filteredTeachers.length === 0 ? (
            <div className="text-center py-12">
              <Users size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No teachers found</h3>
              <p className="text-gray-500">Try adjusting your search</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTeachers.map((teacher) => (
                <div key={teacher.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Mail size={14} />
                        <span>{teacher.email}</span>
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <BookOpen size={16} className="text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Subjects:</p>
                            <p className="text-sm text-gray-600">{teacher.subjects.join(', ')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Users size={16} className="text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Classes:</p>
                            <p className="text-sm text-gray-600">{teacher.classes.join(', ')}</p>
                          </div>
                        </div>
                        
                        {teacher.isClassTeacher && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              Class Teacher: {teacher.classTeacherOf}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}