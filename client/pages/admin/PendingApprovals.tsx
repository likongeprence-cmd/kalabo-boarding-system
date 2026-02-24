// src/pages/admin/PendingApprovals.tsx
import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, CheckCircle, XCircle, Clock, Mail, User as UserIcon, BookOpen } from 'lucide-react';

interface PendingUser {
  id: string;
  email: string;
  name: string;
  userType: string;
  teacherDetails?: any;
  createdAt: string;
}

export default function PendingApprovals() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const q = query(
        collection(db, 'users'),
        where('isApproved', '==', false),
        where('userType', 'in', ['subject_teacher', 'class_teacher', 'hod'])
      );
      
      const querySnapshot = await getDocs(q);
      const users: PendingUser[] = [];
      
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() } as PendingUser);
      });
      
      setPendingUsers(users);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    setProcessingId(userId);
    try {
      await updateDoc(doc(db, 'users', userId), {
        isApproved: true,
        approvedAt: new Date().toISOString(),
        approvedBy: user?.id
      });
      
      // Remove from list
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error approving user:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId: string) => {
    setProcessingId(userId);
    try {
      // You might want to delete or mark as rejected
      await updateDoc(doc(db, 'users', userId), {
        isApproved: false,
        rejectedAt: new Date().toISOString(),
        rejectedBy: user?.id
      });
      
      // Remove from list
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error rejecting user:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const getUserTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'subject_teacher': 'Subject Teacher',
      'class_teacher': 'Class Teacher',
      'hod': 'Head of Department'
    };
    return labels[type] || type;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
          <p className="text-gray-600 mt-1">
            Review and approve teacher account requests
          </p>
        </div>

        {/* Pending Users List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Pending Approvals</h3>
              <p className="text-gray-500">All teacher accounts have been reviewed</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pendingUsers.map((pendingUser) => (
                <div key={pendingUser.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserIcon size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{pendingUser.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail size={14} />
                            <span>{pendingUser.email}</span>
                          </div>
                        </div>
                      </div>

                      <div className="ml-13 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {getUserTypeLabel(pendingUser.userType)}
                          </span>
                          <span className="flex items-center gap-1 text-gray-500">
                            <Clock size={14} />
                            {new Date(pendingUser.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {pendingUser.teacherDetails && (
                          <div className="bg-gray-50 rounded-lg p-3 mt-2">
                            {pendingUser.teacherDetails.department && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Department:</span> {pendingUser.teacherDetails.department}
                              </p>
                            )}
                            
                            {pendingUser.teacherDetails.subjects && (
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Subjects:</span>{' '}
                                {pendingUser.teacherDetails.subjects.map((s: any) => s.subject).join(', ')}
                              </p>
                            )}
                            
                            {pendingUser.teacherDetails.classTeacherOf && (
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Class Teacher of:</span> {pendingUser.teacherDetails.classTeacherOf}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleApprove(pendingUser.id)}
                        disabled={processingId === pendingUser.id}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {processingId === pendingUser.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <CheckCircle size={16} />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(pendingUser.id)}
                        disabled={processingId === pendingUser.id}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
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