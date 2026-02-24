// src/pages/hod/DepartmentPerformance.tsx
import { Layout } from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { BarChart3, TrendingUp, Users, BookOpen } from 'lucide-react';

export default function DepartmentPerformance() {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // Mock data - replace with actual data from Firestore
  const departmentStats = {
    totalStudents: 245,
    totalTeachers: 8,
    averagePerformance: 68.5,
    subjects: 12
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Department Performance</h1>
          <p className="text-gray-600 mt-1">
            {user?.teacherDetails?.department || 'Department'} Overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
              <Users size={20} className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{departmentStats.totalStudents}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Department Teachers</h3>
              <Users size={20} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{departmentStats.totalTeachers}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Avg. Performance</h3>
              <TrendingUp size={20} className="text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{departmentStats.averagePerformance}%</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Subjects</h3>
              <BookOpen size={20} className="text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{departmentStats.subjects}</p>
          </div>
        </div>

        {/* Subject Filter */}
        <div className="mb-6">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Subjects</option>
            <option value="math">Mathematics</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
          </select>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <BarChart3 size={48} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Performance chart will be displayed here</p>
              <p className="text-sm text-gray-400">Coming soon with actual data</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}