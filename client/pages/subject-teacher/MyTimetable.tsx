// src/pages/subject-teacher/MyTimetable.tsx
import { Layout } from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Clock, BookOpen } from 'lucide-react';

interface TimetableSlot {
  day: string;
  time: string;
  subject: string;
  class: string;
  room: string;
}

export default function MyTimetable() {
  const { user } = useAuth();

  // Mock data - replace with actual data
  const timetable: TimetableSlot[] = [
    { day: 'Monday', time: '08:00 - 09:00', subject: 'Mathematics', class: 'Grade 10A', room: 'Room 101' },
    { day: 'Monday', time: '09:00 - 10:00', subject: 'Mathematics', class: 'Grade 10B', room: 'Room 102' },
    { day: 'Monday', time: '11:00 - 12:00', subject: 'Additional Mathematics', class: 'Grade 11A', room: 'Room 101' },
    { day: 'Tuesday', time: '08:00 - 09:00', subject: 'Mathematics', class: 'Grade 11B', room: 'Room 103' },
    { day: 'Tuesday', time: '10:00 - 11:00', subject: 'Mathematics', class: 'Grade 12A', room: 'Room 101' },
    { day: 'Wednesday', time: '09:00 - 10:00', subject: 'Additional Mathematics', class: 'Grade 12B', room: 'Room 102' },
    { day: 'Thursday', time: '08:00 - 09:00', subject: 'Mathematics', class: 'Grade 10A', room: 'Room 101' },
    { day: 'Thursday', time: '11:00 - 12:00', subject: 'Mathematics', class: 'Grade 11A', room: 'Room 103' },
    { day: 'Friday', time: '08:00 - 09:00', subject: 'Mathematics', class: 'Grade 10B', room: 'Room 102' },
    { day: 'Friday', time: '10:00 - 11:00', subject: 'Additional Mathematics', class: 'Grade 11B', room: 'Room 101' },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '14:00 - 15:00', '15:00 - 16:00'];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Timetable</h1>
          <p className="text-gray-600 mt-1">
            Weekly teaching schedule
          </p>
        </div>

        {/* Timetable Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-6 gap-0">
              <div className="p-4 bg-gray-50 border-r border-gray-200 font-medium text-gray-700">
                Time
              </div>
              {days.map(day => (
                <div key={day} className="p-4 bg-gray-50 border-r border-gray-200 font-medium text-gray-700 text-center">
                  {day}
                </div>
              ))}
            </div>

            {/* Time Slots */}
            {timeSlots.map(time => (
              <div key={time} className="grid grid-cols-6 gap-0 border-t border-gray-200">
                <div className="p-4 bg-gray-50 border-r border-gray-200 text-sm text-gray-600">
                  <Clock size={16} className="inline mr-2" />
                  {time}
                </div>
                
                {days.map(day => {
                  const slot = timetable.find(t => t.day === day && t.time === time);
                  
                  return (
                    <div key={`${day}-${time}`} className="p-4 border-r border-gray-200">
                      {slot ? (
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <div className="flex items-center gap-1 text-sm font-medium text-blue-700">
                            <BookOpen size={14} />
                            {slot.subject}
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            {slot.class} • {slot.room}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-300 text-xs text-center">—</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-blue-700">
            <Calendar size={20} />
            <span className="font-medium">Total Teaching Hours: 20 periods per week</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}