// src/pages/subject-teacher/SubjectPerformance.tsx
import { Layout } from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { BookOpen, TrendingUp, Users, BarChart3 } from 'lucide-react';

interface ClassPerformance {
  className: string;
  average: number;
  highest: number;
  lowest: number;
  students: number;
}

export default function SubjectPerformance() {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState('Term 1');

  // Mock data - replace with actual data
  const subjects = ['Mathematics', 'Physics', 'Chemistry'];
  
  const classPerformance: ClassPerformance[] = [
    { className: 'Grade 10A', average: 72, highest: 98, lowest: 45, students: 35 },
    { className: 'Grade 10B', average: 68, highest: 95, lowest: 42, students: 34 },
    { className: 'Grade 11A', average: 75, highest: 96, lowest: 48, students: 32 },
    { className: 'Grade 11B', average: 71, highest: 94, lowest: 44, students: 33 },
  ];

  const overallAverage = classPerformance.reduce((acc, curr) => acc + curr.average, 0) / classPerformance.length;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Subject Performance</h1>
            <p className="text-gray-600 mt-1">
              Track performance across your classes
            </p>
          </div>
          
          <div className="flex gap-3 mt-4 sm:mt-0">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Term 1</option>
              <option>Term 2</option>
              <option>Term 3</option>
            </select>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Overall Average</h3>
              <TrendingUp size={20} className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{overallAverage.toFixed(1)}%</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Classes Taught</h3>
              <Users size={20} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{classPerformance.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
              <BookOpen size={20} className="text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {classPerformance.reduce((acc, curr) => acc + curr.students, 0)}
            </p>
          </div>
        </div>

        {/* Performance by Class */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Performance by Class</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Highest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lowest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {classPerformance.map((cls) => (
                  <tr key={cls.className} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{cls.className}</td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${
                        cls.average >= 70 ? 'text-green-600' :
                        cls.average >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {cls.average}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{cls.highest}%</td>
                    <td className="px-6 py-4 text-gray-600">{cls.lowest}%</td>
                    <td className="px-6 py-4 text-gray-600">{cls.students}</td>
                    <td className="px-6 py-4">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            cls.average >= 70 ? 'bg-green-500' :
                            cls.average >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${cls.average}%` }}
                        ></div>
                      </div>
                    </td>
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