// src/pages/class-teacher/DailyAttendance.tsx
import { Layout } from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Users, Save } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  present: boolean;
}

export default function DailyAttendance() {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Akufuna Miyanda', present: true },
    { id: '2', name: 'Banda Chileshe', present: true },
    { id: '3', name: 'Chisenga Mulenga', present: false },
    { id: '4', name: 'Daka Phiri', present: true },
    { id: '5', name: 'Banda Mwila', present: true },
  ]);

  const toggleAttendance = (id: string) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === id ? { ...student, present: !student.present } : student
      )
    );
  };

  const markAllPresent = () => {
    setStudents(prev => prev.map(student => ({ ...student, present: true })));
  };

  const saveAttendance = () => {
    console.log('Saving attendance:', { date, students });
    // Save to Firestore
  };

  const presentCount = students.filter(s => s.present).length;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Daily Attendance Register</h1>
          <p className="text-gray-600 mt-1">
            Class: {user?.teacherDetails?.classTeacherOf || 'Not Assigned'}
          </p>
        </div>

        {/* Date and Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={markAllPresent}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle size={18} />
                Mark All Present
              </button>
              <button
                onClick={saveAttendance}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save Attendance
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            <span className="text-blue-700 font-medium">Total Students: {students.length}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-green-600 font-medium">Present: {presentCount}</span>
            <span className="text-red-600 font-medium">Absent: {students.length - presentCount}</span>
          </div>
        </div>

        {/* Attendance List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
            <div className="col-span-1">#</div>
            <div className="col-span-8">Student Name</div>
            <div className="col-span-3">Status</div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {students.map((student, index) => (
              <div key={student.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                <div className="col-span-1 text-gray-500">{index + 1}</div>
                <div className="col-span-8 font-medium text-gray-900">{student.name}</div>
                <div className="col-span-3">
                  <button
                    onClick={() => toggleAttendance(student.id)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      student.present
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {student.present ? (
                      <>
                        <CheckCircle size={16} />
                        Present
                      </>
                    ) : (
                      <>
                        <XCircle size={16} />
                        Absent
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}