// src/pages/class-teacher/ClassPerformance.tsx
import { Layout } from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { TrendingUp, TrendingDown, BookOpen, Users, Award } from 'lucide-react';

interface SubjectPerformance {
  subject: string;
  average: number;
  highest: number;
  lowest: number;
  students: number;
}

export default function ClassPerformance() {
  const { user } = useAuth();
  const [selectedTerm, setSelectedTerm] = useState('Term 1');

  // Mock data - replace with actual data
  const classStats = {
    totalStudents: 45,
    overallAverage: 68.5,
    highestAverage: 85,
    lowestAverage: 45
  };

  const subjectPerformance: SubjectPerformance[] = [
    { subject: 'Mathematics', average: 72, highest: 98, lowest: 35, students: 45 },
    { subject: 'English', average: 75, highest: 95, lowest: 40, students: 45 },
    { subject: 'Science', average: 68, highest: 92, lowest: 38, students: 45 },
    { subject: 'Social Studies', average: 71, highest: 94, lowest: 42, students: 45 },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Class Performance</h1>
            <p className="text-gray-600 mt-1">
              {user?.teacherDetails?.classTeacherOf || 'My Class'} - Overview
            </p>
          </div>
          
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="mt-4 sm:mt-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Term 1</option>
            <option>Term 2</option>
            <option>Term 3</option>
          </select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
              <Users size={20} className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{classStats.totalStudents}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Class Average</h3>
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{classStats.overallAverage}%</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Highest Average</h3>
              <Award size={20} className="text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{classStats.highestAverage}%</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Needs Improvement</h3>
              <TrendingDown size={20} className="text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{classStats.lowestAverage}%</p>
          </div>
        </div>

        {/* Subject Performance Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Subject Performance</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Highest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lowest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subjectPerformance.map((subject) => (
                  <tr key={subject.subject} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{subject.subject}</td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${
                        subject.average >= 70 ? 'text-green-600' :
                        subject.average >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {subject.average}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{subject.highest}%</td>
                    <td className="px-6 py-4 text-gray-600">{subject.lowest}%</td>
                    <td className="px-6 py-4 text-gray-600">{subject.students}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}