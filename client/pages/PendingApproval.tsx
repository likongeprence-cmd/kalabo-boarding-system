// src/pages/PendingApproval.tsx
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Clock, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function PendingApproval() {
  const { user, logout } = useAuth();

  return (
    <Layout className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={40} className="text-amber-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Account Pending Approval
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for registering as a {user?.userType?.replace('_', ' ')}. 
            Your account is currently awaiting approval from the school planner.
            You will be notified once your account is activated.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• The planner will review your registration details</li>
              <li>• You'll receive an email when your account is approved</li>
              <li>• Once approved, you can sign in and access your dashboard</li>
            </ul>
          </div>
          
          <button
            onClick={logout}
            className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Sign Out
          </button>
          
          <p className="text-sm text-gray-500 mt-4">
            Need help? Contact the school administrator
          </p>
        </div>
      </div>
    </Layout>
  );
}